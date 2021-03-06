import axios from 'axios';

let apiBaseurl = 'http://localhost:9090/api/';

var instance = axios.create({
  baseURL: apiBaseurl,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// 添加响应拦截器
instance.interceptors.response.use(res => {
  return Promise.resolve(res.data);
}, error => {
  return Promise.reject(error);
});

export default instance;
