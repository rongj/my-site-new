import axios from './request.js'

const api = {
  // 登录
  login: data => axios.post('passport/login', data),

  // 登出
  logout: () => axios.get('passport/logout'),

  // 注册
  register: data => axios.post('passport/register', data),

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