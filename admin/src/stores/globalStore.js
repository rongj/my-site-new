import { observable, action } from 'mobx';
import message from '@/utils/message';
import { routingStore } from '@/App';

class GlobalStore {
  // 登录用户
  @observable
  user = JSON.parse(window.localStorage.getItem('BLOG_USER')) || {}

  // 登录跳转页面
  @observable
  redirectUrl = '/'

  // 清除登录信息调转到登录界面
  @action
  clearUserData = () => {
    window.localStorage.removeItem('BLOG_USER');
    let { history, location } = routingStore;
    let currentPath = location.pathname;
    this.user = {};
    this.redirectUrl = currentPath || '/';
    history.push('/login');
  }

  // 登出
  @action
  handleLogout = () => {
    message.success('登出成功');
    this.clearUserData();
  }

}

export default new GlobalStore();