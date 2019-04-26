import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd';

import { LoginService } from './login.service';

import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	validateForm: FormGroup;
	username: AbstractControl;
	password: AbstractControl;
	submiting: boolean = false;

	constructor(
		private fb: FormBuilder,
		private message: NzMessageService,
		private route: ActivatedRoute,
		private router: Router,
		private loginService: LoginService
	) {
		this.validateForm = this.fb.group({
			username: [null, [Validators.required]],
			password: [null, [Validators.required]],
		});

		this.username = this.validateForm.controls['username'];
		this.password = this.validateForm.controls['password'];
	}

	submitForm(): void {
		for (const i in this.validateForm.controls) {
			this.validateForm.controls[i].markAsDirty();
			this.validateForm.controls[i].updateValueAndValidity();
		}
		this.submiting = true;
		if(this.validateForm.valid) {
			this.loginService.login({  username: this.username.value, password: this.password.value }).subscribe(res => {
				this.submiting = false
				if(res.code === '200') {
					this.message.success('登录成功');
					// DC3.0 - 登录成功
					window.localStorage.setItem('USER_NAME', res.entity.realname);
					window.localStorage.setItem('USER_CNAME', res.entity.username);
					window.localStorage.setItem('HAS_LOGIN', 'true');
					
					this.router.navigate([this.loginService.redirectUrl]);
				} else {
					this.message.error('用户名或密码错误');
				}
			}, error => {
				this.submiting = false
			})
		}
	}


	ngOnInit(): void {

	}

}
