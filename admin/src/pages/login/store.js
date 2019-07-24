import { observable, action } from 'mobx';
import globalStore from '@/stores/globalStore';
import message from '@/utils/message';
import { routingStore } from '@/App';
import { api_auth } from '@/services';

class Store {
  // 登录表单输入
  @observable
  loginForm = {
    uname: '',
    pwd: '',
  };

  // 是否可提交
  @observable
  ableSubmit = true;

  // 表单输入
  @action
  setLoginForm (type, v) {
    this.loginForm[type] = v;
  }

  // 表单提交
  @action
  handleLogin = async () => {
    let { uname, pwd } = this.loginForm;
    if(!uname || !pwd) {
      message.error('用户名或密码不能为空');
      return;
    }
    this.ableSubmit = false;
    let formData = new FormData();
    formData.append('uname', uname);
    formData.append('passwd', pwd);
    await api_auth.login({ uname, passwd: pwd, formData }).then(res => {
      this.ableSubmit = true;
      if(res.code === '1001' || res.code === 200) {
        message.success('登录成功');
        this.loginForm = {};
        if(res.data && res.data.user) {
          let loginUser = res.data.user || {};
          window.localStorage.setItem('OUT_DC_USER', JSON.stringify(loginUser));
          globalStore.user = loginUser;
          globalStore.authLoading = true;
          globalStore.getAuth();
          let redirectUrl = globalStore.redirectUrl;
          routingStore.history.replace(redirectUrl === '/login' ? '/' : redirectUrl);
        }
      } else {
        message.error(res.msg);
      }
    }).catch(e => {
      this.ableSubmit = true;
    })

  }
}

export default new Store();