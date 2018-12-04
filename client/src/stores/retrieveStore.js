import { observable, action } from 'mobx';
import api_user from '../services/user';

import { message } from 'antd';
import * as _ from '../utils/tool';

import { encrypt } from '../utils/encrypt';

class retrieveStore {
	/**
	 * 手机找回
	 */
	// 表单输入
	@observable phoneForm = {
		mobile: '',
		imgCode: '',
		newPassword: '',
		mobileCode: '',
	};

	// 图片验证码
	@observable phoneImgCodeUrl = '';

	// 是否可以发送短信验证码
	@observable ableSendMsg = true;
	@observable countDown = 60;

	// 表单输入
	@action setPhoneForm (type, v) {
		this.phoneForm[type] = v;

		// 输入手机号的时候将图片验证码和短信验证码清空
		if(type === 'mobile') {
			this.phoneImgCodeUrl = '';
			this.phoneForm.imgCode = '';
			this.phoneForm.mobileCode = '';
		}
	}

	// 检测输入的手机号码格式
	@action onMobileBlur = v => {
		if(_.testPhone(v) && this.phoneImgCodeUrl.indexOf(this.phoneForm.mobile) === -1) {
			this.getImgCode();
		}
	}

	// 获取短信验证码图片
	@action getImgCode = () => {
		this.phoneImgCodeUrl = api_user.getMobileImgcode({ mobile: this.phoneForm.mobile });
	}

	// 发送短信验证码
	@action sendMsgCode = async () => {
		let { mobile, imgCode } = this.phoneForm;

		if(_.testPhone(mobile)) {
			if(!imgCode) {
				message.error('请输入图形验证码')
				return
			}
			return api_user.sendMsgCode({ mobile, imgCode }).then(res => {
				if(res.data.retCode === 1) {
					message.success('短信验证码发送成功');
					this.ableSendMsg = false;
					let timer = setInterval(()=> {
						if(this.countDown > 1) {
							this.countDown--
						} else {
							this.ableSendMsg = true;
							this.countDown = 60;
							clearInterval(timer)
						}
					}, 1000)			
				} else {
					message.error(res.data.errorMsg);
				}
			})

		}
	}

	// 是否可提交
	@observable ableSubmit = true;

	// 手机找回表单提交
	@action handSubmitResetByPhone = async () => {

		let { mobile, newPassword, mobileCode } = this.phoneForm;

		if(_.testPhone(mobile) &&
			_.testPassword(newPassword)) {
			if(!mobileCode) {
				message.error('手机验证码不能为空');
				return
			}
			
			this.ableSubmit = false;

			return api_user.getPubkeyByMobile({ mobile }).then(res => {
				if(res.data.retCode === 1) {
					return api_user.mobilePassword({ mobile, newPassword: encrypt(res.data.data, newPassword), mobileCode}).then(res => {
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



	/**
	 * 邮箱找回
	 */
	// 表单输入
	@observable emailForm = {
		email: '',
		imgCode: '',
		newPassword: '',
		emailCode: '',
	};

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
		let { email, imgCode } = this.emailForm;

		if(_.testEmail(email)) {
			if(!imgCode) {
				message.error('请输入图形验证码')
				return
			}
			return api_user.sendEmailCodeNologin({ email, imgCode }).then(res => {
				if(res.data.retCode === 1) {
					message.success('邮箱验证码发送成功');
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
				} else {
					message.error(res.data.errorMsg);
				}
			})

		}
	}

	// 邮箱找回表单提交
	@action handSubmitResetByEmail = async () => {

		let { email, newPassword, emailCode } = this.emailForm;

		if(_.testEmail(email) &&
			_.testPassword(newPassword)) {
			if(!emailCode) {
				message.error('邮箱验证码不能为空');
				return
			}
			
			this.ableSubmit = false;

			return api_user.getPubkeyByEmail({ email }).then(res => {
				if(res.data.retCode === 1) {
					return api_user.emailPassword({ email, newPassword: encrypt(res.data.data, newPassword), emailCode}).then(res => {
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

export default new retrieveStore();