import { observable, action } from 'mobx';
import { api_auth } from '@/services';
import message from '@/utils/message';
import { routingStore } from '@/App';
import { getTreeInnerKeys } from '@/utils/tools';

class GlobalStore {
  // 登录用户
  @observable
  user = JSON.parse(window.localStorage.getItem('OUT_DC_USER')) || {}

  // 登录跳转页面
  @observable
  redirectUrl = '/'

  // 用户路由权限
  @observable
  authMenus = []

  // 用户可访问的前端路由
  @observable
  authRoutes = []
  
  // 权限请求状态
  @observable
  authLoading = true
  
  // 获取权限
  @action
  getAuth = () => {
    api_auth.getAuth({
      requirePermission: true,
      treePermission: true,
      menuOnly: true,
      projectId: 22
    }).then(res => {
      if(res.code === '1001' || res.code === 200) {
        this.authLoading = false;
        let d = res.data || [];
        // 获取所有权限菜单
        let allMenus = d.length ? d[0].subPermission || [] : [];
        this.authMenus = allMenus;
        // 获取所有的页面菜单地址
        let authRoutes = getTreeInnerKeys(allMenus, 'modelpage', 'subPermission');
        this.authRoutes = authRoutes;
      }
    })
  }

  // 清除登录信息调转到登录界面
  @action
  clearUserData = () => {
    window.localStorage.removeItem('OUT_DC_USER');
    let { history, location } = routingStore;
    let currentPath = location.pathname;
    this.user = {};
    this.redirectUrl = currentPath || '/';
    history.push('/login');
  }

  // 登出
  @action
  handleLogout = () => {
    api_auth.logout().then(res => {
      if(res.code === '1001' || res.code === 200) {
        message.success('登出成功');
        this.clearUserData();
      }
    });
  }

}

export default new GlobalStore();