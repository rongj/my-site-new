import { observable, action } from 'mobx';
import api_work from '../services/work';
import appStore from './appStore';
import { message } from 'antd';

import axios from 'axios'

function getBase64(img, callback) {
	const reader = new FileReader();
	reader.addEventListener('load', () => callback(reader.result));
	reader.readAsDataURL(img);
}

class workCreateStore {
	// 登录表单输入
	@observable createForm = {
		workOrderType: "0",
		theme: '',
		attachUrl: '',
		content: '',
	};

	// 是否可提交
	@observable ableSubmit = true;

	// 表单输入
	@action setCreateForm (type, v) {
		this.createForm[type] = v;
	}

	// 图片上传地址
	uploadUrl = () => {
		let { uid } = appStore.user;
		return api_work.uploadUrl({ uid })
	}

	// 是否上传图片中
	@observable uploadLoading = false;


	@action handleUploadChange = info => {
		let { uid } = appStore.user;

		console.log(info);

		if (info.file.status === 'uploading') {
			this.uploadLoading = true;
			return
		}
		if (info.file.status === 'done') {

			getBase64(info.file.originFileObj, imageUrl => {
				console.log(imageUrl);
			});
		}

		let formdata = new FormData()
		formdata.append('uid', uid);
		formdata.append('uploadFile', info.file);
		formdata.append('imgType', 'WORKORDER_IMG');
		axios({
			url: 'http://118.24.73.169:8082/api/v1/upload/pic/1700012',
			method: 'post',
			data: formdata,
			headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}).then((res)=>{console.log(res)})

		// api_work.upload({ uid, formData })
	}

	// 表单提交
	@action handSubmitCreate = async () => {
		let { workOrderType, theme, attachUrl, content } = this.createForm;

		if(!theme) {
			message.error('工单主题不能为空')
			return false
		}

		if(!content) {
			message.error('请详细描述您要反馈的问题')
			return false
		}

		this.ableSubmit = false;

		let { uid } = appStore.user;

		return api_work.createNewWorkOrder({ uid, workOrderType: Number(workOrderType), theme, attachUrl, content }).then(res => {
			this.ableSubmit = true;
			if(res.data.retCode === 1) {
				return res.data
			} else {
				if(res.data.errorMsg) {
					message.error(res.data.errorMsg);
				}
			}
		})
	}
}

export default new workCreateStore();