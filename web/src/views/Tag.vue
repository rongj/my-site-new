<template>
  <div class="panel-item">
    <h2 class="panel-title">标签</h2>
    <div class="tags-list">
      <router-link
        v-for="(item, i) in tagList"
        :key="i"
        :to="{ name: 'list', query: { type: 'tag', id: item.id, name: item.name }}"
        class="link">
        {{item.name}}({{item.article_num || 0}})
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    asyncData ({ store, route }) {
      return store.dispatch('getTagList')
    },
    computed: mapState(['tagList']),
    // created() {
    //   this.getTagList()
    // },
    // methods: mapActions(['getTagList']),
  }
</script>

<style lang="scss">
  @import '@/styles/panel_list.scss';
</style>
