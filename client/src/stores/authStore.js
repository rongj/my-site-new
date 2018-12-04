import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { message } from 'antd';

import * as _ from '../utils/tool';

class authStore {
	// 登录表单输入
	@observable passwordForm = {
		oldPassword: '123456798',
		newPassword: 'mima123456',
		newPassword2: 'mima123456',
	};

	// 表单输入
	@action setChangeForm (type, v) {
		this.passwordForm[type] = v;
	}

	// 表单提交
	@action handSubmitChange = async () => {

		let { oldPassword, newPassword, newPassword2 } = this.passwordForm;

		if(!oldPassword || !newPassword || !newPassword2) {
			message.error('密码不能为空')
			return false
		}

		if(oldPassword === newPassword) {
			message.error('新密码不能与新密码相同')
			return false
		}

		if(newPassword !== newPassword2) {
			message.error('两次输入密码不一致')
			return false
		}

		if(_.testPassword(newPassword)
			&& _.testPassword(newPassword)) {

			this.ableSubmit = false;

			let { uid, token } = appStore.user;

			return api_user.changePassword({ oldPassword, newPassword, uid, token }).then(res => {
				this.ableSubmit = true;
				if(res.data.errorMsg) {
					message.error(res.data.errorMsg);
				}
				return res.data
			}).catch(e => {
				this.ableSubmit = true;
			})
		}

	}
}

export default new authStore();