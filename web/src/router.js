import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'list',
      component: () => import(/* webpackChunkName: "home" */ './views/Home.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import(/* webpackChunkName: "article" */ './views/Article.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ './views/Category.vue'),
    },
    {
      path: '/tag',
      name: 'tag',
      component: () => import(/* webpackChunkName: "tag" */ './views/Tag.vue'),
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import(/* webpackChunkName: "archive" */ './views/Archive.vue'),
    },
    {
      path: '/tool',
      name: 'tool',
      component: () => import(/* webpackChunkName: "tool" */ './views/Tool.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});


export default router;
