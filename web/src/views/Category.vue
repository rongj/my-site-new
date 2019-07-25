<template>
  <div class="panel-item">
    <h2 class="panel-title">分类</h2>
    <div class="tags-list">
      <router-link
        v-for="(item, i) in categoryList"
        :key="i"
        :to="{ name: 'list', query: { type: 'category', id: item.id, name: item.name }}"
        class="link">
        {{item.name}}({{item.article_num || 0}})
      </router-link>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    computed: mapState(['categoryList']),
    created() {
      this.getCategoryList()
    },
    methods: mapActions(['getCategoryList']),
  }
</script>

<style lang="scss">
  @import '@/styles/panel_list.scss';
</style>
