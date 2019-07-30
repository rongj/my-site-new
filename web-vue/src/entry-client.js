import Vue from 'vue'
import { createApp } from './main'

// 匹配要渲染的视图后，再获取数据
// 当路由导航被触发时，可以立即切换视图，应用程序具有更快的响应速度
Vue.mixin({
  // beforeMount() {
  //   const { asyncData } = this.$options
  //   if (asyncData) {
  //     // 将获取数据操作分配给 promise
  //     // 以便在组件中，我们可以在数据准备就绪后
  //     // 通过运行 `this.dataPromise .then(...)` 来执行其他任务
  //     this.dataPromise = asyncData({
  //       store: this.$store,
  //       route: this.$route
  //     })
  //   }
  // },

  // 当路由组件重用 也应该调用 asyncData 函数
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

// 同步混淆服务端渲染数据
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 客户端渲染
router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，
  // 以便我们不会二次预取(double-fetch)已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心之前没有渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        next()
      })
      .catch(next)
  })

  app.$mount('#app')
})