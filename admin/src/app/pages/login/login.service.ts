import { Injectable } from '@angular/core';

import { ApiService } from '@utils/api.service';

@Injectable()
export class LoginService {

	constructor(
		private apiService: ApiService,
	) {}

	// 登录后跳转地址
	redirectUrl: string = '/';

	login(data: Object = {}) {
		return this.apiService.post('login/in', data)
	}

	logout() {
		return this.apiService.get('qqoauth/loginout')
	}

	getLeftMenu() {
		return this.apiService.get('login/getleftmenu')
	}
}
