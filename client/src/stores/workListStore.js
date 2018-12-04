import { observable, action } from 'mobx';
import api_work from '../services/work';
import appStore from './appStore';
import { message } from 'antd';

class workListStore {

	// 分页信息
	@observable pageNum = 1;
	@observable pageSize = 15;


	// 获取列表
	@action getWorkList = () => {
		let { uid } = appStore.user;
		return api_work.getPublishNewsByTypeAndPageInfo({
			Uid: uid,
			pageNum: 1,
			pageSize: 15,
		}).then(res => {
			console.log(res);
		})
	}

}

export default new workListStore();