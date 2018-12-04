import { observable, action, reaction } from 'mobx';

class AppStore {
	@observable user = JSON.parse(window.localStorage.getItem('token')) || {};

	// 设置登录用户信息
	@action setUser = data => {
		if(data.uid) {
			this.user = data;
			window.localStorage.setItem('token', JSON.stringify(data));
		}
	}

	// 更新登录用户信息
	@action updateUser = data => {
		let d = Object.assign(this.user, data)
		if(d.uid) {
			this.user = d;
			window.localStorage.setItem('token', JSON.stringify(d));
		}
	}

	@action logout = () => {
		this.user = {};
		window.localStorage.removeItem('token');
	}
}

export default new AppStore();