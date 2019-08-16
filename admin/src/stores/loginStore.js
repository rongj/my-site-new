import { observable, action } from 'mobx';
import globalStore from '@/stores/globalStore';
import message from '@/utils/message';
import api from '@/services/api';
import { routingStore } from '@/App';

class LoginStore {
  @observable
  submitLoading = false
  
  // 表单提交
  @action
  handleLogin = async (loginForm) => {
    this.submitLoading = true;
    await api.login(loginForm).then(res => {
      this.submitLoading = false;
      if(res.code === '1001' || res.code === 200) {
        message.success('登录成功');
        let loginUser = res.data || {};
        window.localStorage.setItem('BLOG_USER', JSON.stringify(loginUser));
        globalStore.user = loginUser;
        let redirectUrl = globalStore.redirectUrl;
        routingStore.history.replace(redirectUrl === '/login' ? '/' : redirectUrl);
      } else {
        message.error(res.msg);
      }
    }).catch(e => {
      this.submitLoading = false;
    })
  }

}

export default new LoginStore();