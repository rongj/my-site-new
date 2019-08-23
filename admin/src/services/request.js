import axios from 'axios';
import message from '@/utils/message';

import globalStore from '@/stores/globalStore';

let apiBaseurl = 'http://blog.api.nodepy.com/';

// let host = window.location.hostname;
// if(host === 'blog.nodepy.com') {    // 测试
//   apiBaseurl = '//blog.api.nodepy.com/';
// }

var instance = axios.create({
  baseURL: apiBaseurl,
  // timeout: 15000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
  let user = globalStore.user || {};
  config.headers['Authorization'] = user.token || null;
  return config;
}, error => {
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(res => {
  // 未登录权限控制
  if(res.data.code === 401) {
    globalStore.clearUserData()
  }
  return Promise.resolve(res.data);
}, error => {
  return Promise.reject(error);
});

export default instance;
