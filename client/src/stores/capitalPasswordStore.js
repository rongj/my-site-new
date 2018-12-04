import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { message } from 'antd';

import * as _ from '../utils/tool';

import { encrypt } from '../utils/encrypt';

class capitalPasswordStore {
	// 修改密码
	@observable passwordForm = {
		oldPassword: '',
		newPassword: '',
		newPassword2: '',
	};

	// 表单修改
	@action setChangeForm (type, v) {
		this.passwordForm[type] = v;
	}

	// 是否可提交
	@observable ableSubmit = true;

	// 表单提交
	@action handSubmitChange = async (type) => {
		let { oldPassword, newPassword, newPassword2 } = this.passwordForm;

		if(!newPassword || !newPassword2) {
			message.error('密码不能为空')
			return false
		}

		if(oldPassword === newPassword && type === 'second') {
			message.error('新密码不能与旧密码相同')
			return false
		}

		if(newPassword !== newPassword2) {
			message.error('两次输入密码不一致')
			return false
		}

		if(_.testFundPassword(newPassword)) {
			this.ableSubmit = false;
			let { uid, token } = appStore.user;

			return api_user.getFundPubkey({ uid, token }).then(res => {
				if(res.data.retCode === 1) {
					return api_user[type === 'second' ? 'changeFundpwd' : 'setFundpwd'](Object.assign({ newPassword: encrypt(res.data.data, newPassword), uid, token }, type === 'second' ? {oldPassword: encrypt(res.data.data, oldPassword)} : {})).then(res => {
						this.ableSubmit = true;
						if(res.data.errorMsg) {
							message.error(res.data.errorMsg);
						}
						return res.data
					}).catch(e => {
						this.ableSubmit = true;
					})
				} else {
					message.error(res.data.errorMsg);
				}
			})
		}
	}
}

export default new capitalPasswordStore();