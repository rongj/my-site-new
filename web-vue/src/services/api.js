import axios from './request.js'

const api = {
  // get all categories
  getCategoryList: () => axios.get('category/list'),

  // get all tags
  getTagList: () => axios.get('tag/list'),

  // get article list
  getArticleList: data => axios.get('article/list', { params: data }),
  
  // get article detail
  getArticleDetail: data => axios.get(`article/${data.id}`),
}

export default api