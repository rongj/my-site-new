import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { message } from 'antd';

import * as _ from '../utils/tool';

import { encrypt } from '../utils/encrypt';

class checkMailStore {
	// 绑定邮箱
	@observable emailForm = {
		email: '',
		imgCode: '',
		code: ''
	}

	// 图片验证码
	@observable emailImgCodeUrl = '';

	// 是否可以发送邮箱验证码
	@observable ableSendEmail = true;
	@observable countDownEmail = 60;

	// 表单输入
	@action setEmailForm (type, v) {
		this.emailForm[type] = v;
		// 输入手机号的时候将图片验证码和短信验证码清空
		if(type === 'email') {
			this.emailImgCodeUrl = '';
			this.emailForm.imgCode = '';
			this.emailForm.emailCode = '';
		}
	}

	// 是否可提交
	@observable ableSubmit = true;

	// 检测输入的邮箱账号
	@action onEmailBlur = v => {
		if(_.testEmail(v) && this.emailImgCodeUrl.indexOf(this.emailForm.email) === -1 ) {
			this.getEmailImgCode();
		}
	}

	// 获取邮箱验证码图片
	@action getEmailImgCode = async () => {
		this.emailImgCodeUrl = api_user.emailImgCode({ email: this.emailForm.email });
	}

	// 发送邮箱验证码
	@action sendEmailCode = async () => {
		let { email, code, imgCode } = this.emailForm;

		if(_.testEmail(email)) {
			if(!imgCode) {
				message.error('请输入图形验证码')	
				return
			}
			return api_user.sendEmailCodeNologin({ email, imgCode }).then(res => {
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
	}

	//表单提交
	@action handSubmitResetByEmail = async () => {

		let { email, code } = this.emailForm;
		let { uid, token } = appStore.user;

		if(_.testEmail(email)) {
			if(!code) {
				message.error('邮箱验证码不能为空');
				return
			}
			
			this.ableSubmit = false;

			return api_user.bindEmail({ email, code, uid, token}).then(res => {
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

export default new checkMailStore();