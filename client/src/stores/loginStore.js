import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { Toast as message } from 'antd-mobile';

import { encrypt } from '../utils/encrypt';

message.error = message.fail;

console.log(message);

class loginStore {
	// 登录表单输入
	@observable loginForm = {
		mobile: '',
		password: '',
	};

	// 是否可提交
	@observable ableSubmit = true;

	// 表单输入
	@action setLoginForm (type, v) {
		this.loginForm[type] = v;
	}

	// 表单提交
	@action handSubmitLogin = async () => {
		let { mobile, password } = this.loginForm;
		if(!mobile || !password) {
			message.error('手机号或密码不能为空')
			return false
		}

		this.ableSubmit = false;

		return api_user.getPubkeyByMobile({ mobile }).then(res => {
			if(res.data.retCode === 1) {
				return api_user.login({ mobile, password: encrypt(res.data.data, password) }).then(res => {
					this.ableSubmit = true;
					if(res.data.errorMsg) {
						message.error(res.data.errorMsg);
					}
					return res.data
				}).catch(e => {
					this.ableSubmit = true;
				})
			} else {
				this.ableSubmit = true;
			}
		})
	}
}

export default new loginStore();