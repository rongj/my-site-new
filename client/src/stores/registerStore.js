import { observable, action } from 'mobx';
import api_user from '../services/user';
import appStore from './appStore';

import { message } from 'antd';
import * as _ from '../utils/tool';
import { encrypt } from '../utils/encrypt';

class registerStore {
	// 注册表单输入
	@observable registerForm = {
		// ciphertext: '',
		// invitionCode: 'nbd8t',
		// password: 'mima123456',
		// mobile: '15026905578',
		// userName: 'rongjie',
		// verifyCode: '123456',
		// imgCode: '1234',
		// readProtocol: true,

		invitionCode: '',
		password: '',
		mobile: '',
		userName: '',
		verifyCode: '',
		imgCode: '',
		readProtocol: true,
	};

	// 加密密码
	@observable ciphertext = '';

	// 临时公钥
	@observable tmpKey = '';

	// 图片验证码
	@observable imgCodeUrl = '';

	// 是否可以发送短信验证码
	@observable ableSendMsg = true;
	@observable countDown = 60;

	// 是否可以提交
	@observable ableSubmit = true;

	// 表单输入
	@action setRegisterForm (type, v) {
		this.registerForm[type] = v;
		// 输入手机号的时候将图片验证码和短信验证码清空
		if(type === 'mobile') {
			this.imgCodeUrl = '';
			this.registerForm.verifyCode = '';
			this.registerForm.imgCode = '';
		}
	}

	// 检测输入的手机号码格式
	@action onMobileBlur = v => {
		if(_.testPhone(v) && this.imgCodeUrl.indexOf(this.registerForm.mobile) === -1 ) {
			this.getImgCode();
		}
	}

	// 获取短信验证码图片
	@action getImgCode = () => {
		this.imgCodeUrl = api_user.getMobileImgcode({ mobile: this.registerForm.mobile });
	}

	// 发送短信验证码
	@action sendMsgCode = async () => {
		let { mobile, imgCode } = this.registerForm;

		if(_.testPhone(mobile)) {
			if(!imgCode) {
				message.error('请输入图形验证码')
				return
			}
			api_user.sendMsgCode({ mobile, imgCode }).then(res => {
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

	// 注册提交
	@action handSubmitRegister = async () => {

		let { mobile, userName, password, verifyCode, invitionCode, readProtocol } = this.registerForm;

		if(_.testPhone(mobile) &&
			_.testUsername(userName) &&
			_.testPassword(password)) {
			if(!invitionCode) {
				message.error('邀请码不能为空')
				return
			}
			if(!verifyCode) {
				message.error('手机验证码不能为空')
				return
			}

			if(!readProtocol) {
				message.error('请阅读产品服务条款')
				return
			}

			if(!this.ableSubmit) {
				return
			}

			this.ableSubmit = false;

			return api_user.tmpKey({ mobile }).then(res => {
				if(res.data.retCode === 1) {
					this.tmpKey = res.data.data;
					return api_user.register({ invitionCode, mobile, userName, verifyCode, ciphertext: encrypt(this.tmpKey, password) }).then(res => {
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

export default new registerStore();