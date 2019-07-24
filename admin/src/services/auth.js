import axios, { apiAuthurl } from '@/utils/request';

export const api_auth = {
  /* Auth */
  // 用户登录
  login: data => axios.post(`${apiAuthurl}login?uname=${data.uname}&passwd=${data.passwd}`, data.formData, { headers: {'Content-Type': 'multipart/form-data'}}),

  // 用户登出
  logout: data => axios.post(apiAuthurl + 'logout', data),

  // 获取用户权限菜单
  getAuth: data => axios.post(`${apiAuthurl}privilegeReload?requirePermission=${data.requirePermission || ''}&treePermission=${data.treePermission || ''}&menuOnly=${data.menuOnly || ''}&projectId=${data.projectId || ''}`),
};