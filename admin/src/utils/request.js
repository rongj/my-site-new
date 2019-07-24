import axios from 'axios';
import message from '@/utils/message';

import globalStore from '@/stores/globalStore';

let apiBaseurl = 'http://172.19.14.71:8083/outside-api/';  // 本地地址
export let apiAuthurl = 'http://172.19.14.71:8080/authsys/auth2.0/api/';  // 权限

let host = window.location.hostname;
if(host === 'dc.021.com') {    // 测试
  apiBaseurl = '//dc.021.com/outside-api/';
  apiAuthurl = '//dc.021.com/authsys/auth2.0/api/';
}

export const isProduction = ['172.31.16.10'].indexOf(host) > -1;

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
  if(res.data.code === '2002' || res.data.code === 2002) {
    globalStore.clearUserData()
  }
  return Promise.resolve(res.data);
}, error => {
  let errRes = error.response;
  if(errRes && errRes.config && errRes.config.method === 'post') {
    message.error('请求异常[' + errRes.status + ']');
  }
  return Promise.reject(error);
});

export default instance;
