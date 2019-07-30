<template>
  <div class="article">
    <h3 class="article-title">{{articleDetail.title}}</h3>
    <div class="article-info">
      <span class="item-tags">
        标签：
        <router-link 
          v-for="tag in articleDetail.tags"
          :key="tag.tag_id"
          :to="{ name: 'list', query: { type: 'tag', id: tag.id, name: tag.name }}"
          class="link">{{tag.name}}</router-link>
      </span>
      <span class="item-category">
        分类：
        <router-link :to="{ name: 'list', query: { type: 'category', id: articleDetail.category_id, name: articleDetail.category_name }}" class="link">{{articleDetail.category_name}}</router-link>
      </span>
      <span>{{articleDetail.created_at}}</span>
      <span>{{articleDetail.read_num}}次阅读</span>
      <!-- <span>{{articleDetail.comment_num}}条评论</span> -->
    </div>
    <div class="markdown-body article-body" v-html="articleDetail.content"></div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    asyncData ({ store, route }) {
      return store.dispatch('getArticleDetail', route.params.id)
    },
    
    computed: mapState(['articleDetail']),
    
    title () {
      return this.articleDetail.title
    },
  }
</script>

<style lang="scss">
  @import '@/styles/detail.scss'
</style>
