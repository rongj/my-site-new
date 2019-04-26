import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NZ_MESSAGE_CONFIG  } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';

import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { HttpServiceInterceptor } from '@utils/http.service.interceptor';
import { ApiService } from '@utils/api.service';
import { LoginService } from '@pages/login/login.service';

registerLocaleData(zh);

@NgModule({
	declarations: [
		AppComponent,
		LayoutComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		/** 导入 ng-zorro-antd 模块 **/
		NgZorroAntdModule,
		AppRoutingModule
	],
	bootstrap: [
		AppComponent
	],
	providers: [
		{ provide: NZ_I18N, useValue: zh_CN },
		{ provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 1000 }},
		{ provide: HTTP_INTERCEPTORS, useClass: HttpServiceInterceptor, multi: true },
		ApiService,
		LoginService
	]
})
export class AppModule {}
