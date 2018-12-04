import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { message } from 'antd';

import * as _ from '../utils/tool';

import { encrypt } from '../utils/encrypt';

class capitalRetrieveStore {
	// 修改密码
	@observable passwordForm = {
		newPassword: '',
		mobileCode: '',
		emailCode: ''
	};

	@action setChangeForm (type, v) {
		this.passwordForm[type] = v;
	}

	// 是否可以发送短信验证码
	@observable ableSendMsg = true;
	@observable countDownMsg = 60;

	// 是否可以发送邮箱验证码
	@observable ableSendEmail = true;
	@observable countDownEmail = 60;


	// 发送短信验证码
	@action sendMsgCode = async () => {
		let { uid, token } = appStore.user;

		return api_user.sendEmailCodeLogin({ uid, token }).then(res => {
			if(res.data.retCode === 1) {
				this.ableSendMsg = false;
				let timer = setInterval(()=> {
					if(this.countDownMsg > 1) {
						this.countDownMsg--
					} else {
						this.ableSendMsg = true;
						this.countDownMsg = 60;
						clearInterval(timer)
					}
				}, 1000)			
			}
		})
	}

	// 发送短信验证码
	@action sendEmailCode = async () => {
		let { uid, token } = appStore.user;

		return api_user.sendEmailCodeLogin({ uid, token }).then(res => {
			if(res.data.retCode === 1) {
				this.ableSendEmail = false;
				let timer = setInterval(()=> {
					if(this.countDownEmail > 1) {
						this.countDownEmail--
					} else {
						this.ableSendEmail = true;
						this.countDownEmail = 60;
						clearInterval(timer)
					}
				}, 1000)			
			}
		})
	}

	@observable ableSubmit = true;

	// 提交表单
	@action handSubmitChange = async (type) => {
		let { emailCode, newPassword, mobileCode } = this.passwordForm;

		if(!emailCode) {
			message.error('邮箱验证码不能为空')
			return false
		}

		if(!mobileCode) {
			message.error('短信验证码不能为空')
			return false
		}

		if(_.testFundPassword(newPassword)) {

			this.ableSubmit = false;

			let { uid, token } = appStore.user;

			return api_user.getFundPubkey({ uid, token }).then(res => {
				if(res.data.retCode === 1) {
					return api_user.forgetFundpwd({
						emailCode, newPassword, mobileCode, uid, token
					}).then(res => {
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

export default new capitalRetrieveStore();