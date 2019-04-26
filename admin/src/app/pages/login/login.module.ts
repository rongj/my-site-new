import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginService } from './login.service';

@NgModule({
	declarations: [
		LoginComponent
	],
	imports: [
		CommonModule,
		LoginRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		NgZorroAntdModule,
	],
	providers: [
		LoginService
	]
})
export class LoginModule {}
