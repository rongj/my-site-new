<template>
  <div class="main-list">
    <div class="panel-title" v-if="$route.query.type">{{$route.query.type === 'category' ? '分类' : '标签'}}：{{$route.query.name}}</div>
    <div class="panel-title" v-else>所有文章</div>
    <div class="article-list">
      <div
        class="article-item"
          v-for="item in articleList"
          :key="item.id">
        <h2><router-link :to="`/article/${item.id}`" class="link">{{item.title}}</router-link></h2>
        <p>{{item.summary}}</p>
        <div class="item-info">
          <span class="item-category">
            分类：
            <router-link :to="{ name: 'list', query: { type: 'category', id: item.category_id, name: item.category_name }}" class="link">{{item.category_name}}</router-link>
          </span>
          <span class="item-tags">
            标签：
            <router-link 
              v-for="tag in item.tags"
              :key="tag.tag_id"
              :to="{ name: 'list', query: { type: 'tag', id: tag.id, name: tag.name }}"
              class="link">
              {{tag.name}}
            </router-link>
          </span>
          <span>{{item.created_at}}</span>
          <span>{{item.read_num}}次阅读</span>
          <!-- <span>{{item.comment_num}}条评论</span> -->
        </div>
      </div>
      <div class="no-data" v-if="!articleList.length">暂无数据</div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {    
    asyncData ({ store, route }) {
      return store.dispatch('getArticleList', route.query)
    },
    
    computed: {
      ...mapState([
        'articleList',
        'articleTotal'
      ]),
    },

    watch: {
      '$route': function () {
        this.getData()
      }
    },
    
    // created() {
    //   this.getData()
    // },

    methods: {
      ...mapActions([
        'getArticleList'
      ]),
      
      getData() {
        let { query } = this.$route;
        this.getArticleList(query);
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/article.scss';
</style>