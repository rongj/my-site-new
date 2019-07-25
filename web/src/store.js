import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import api from '@/services/api'

const state = {
  articleList: [],
  articleTotal: 0,
  articlePage: {
    page: 1,
    pageSize: 10,
  },

  articleDetail: {},
  categoryList: [],
  tagList: [],
}

const getters = {
}

const actions = {
  // get article list
  getArticleList({ commit, state }, formData = {}) {
    let category_id = formData.type === 'category' ? formData.id : '';
    let tag_id = formData.type === 'tag' ? formData.id : '';
    let params = {
      ...state.articlePage,
      category_id,
      tag_id,
    };
    api.getArticleList(params).then(res => {
      if(res.code === 200 && res.data) {
        commit('save', {
          'articleList': res.data.list || [],
          'articleTotal': res.data.total
        })
      }
    })
  },

  // get article detail
  getArticleDetail({ commit }, id) {
    api.getArticleDetail({ id }).then(res => {
      if(res.code === 200) {
        commit('save', {'articleDetail': res.data || {}})
      }
    })
  },

  // get all categories
  getCategoryList({ commit }, id) {
    api.getCategoryList({ id }).then(res => {
      if(res.code === 200) {
        commit('save', {'categoryList': res.data || []})
      }
    })
  },

  // get all tags
  getTagList({ commit }, id) {
    api.getTagList({ id }).then(res => {
      if(res.code === 200) {
        commit('save', {'tagList': res.data || []})
      }
    })
  },
}


const mutations = {
	save(state, payload) {
    for(let k in payload) {
      state[k] = payload[k];
    }
  }
}

export default new Vuex.Store({
	// strict: true,
    state,
    getters,
    actions,
    mutations
})
