import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 是否正式环境
const isEnv: boolean = window.location.hostname !== 'report.021.com';

// 旧版
export const BASIC_URL: string = '//123.59.85.60/datacenter/';

// 权限
export const AUTH_BASIC_URL: string = '//123.59.85.60/authsysapi/';

// 报表
export const REPORT_BASIC_URL: string = isEnv ?  '//123.59.85.60/reportsapi/' : '//report.021.com/reportsapi/';

// 自动邮件
export const AUTOMAIL_BASIC_URL: string = isEnv ?  '//123.59.85.60/autoemailapi/' : '//report.021.com/autoemailapi/';

@Injectable()
export class ApiService {
	constructor(
		private http: HttpClient
	) {}

	private formatErrors(error: any) {
		return throwError(error.error)
	}

	private getApiUrl(path: string): string {
		return path.indexOf('//') > -1 ? path : REPORT_BASIC_URL + path
	}

	public get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
		return this.http.get(this.getApiUrl(path), { params })
			.pipe(catchError(this.formatErrors))
	}

	public post(path: string, data: any): Observable<any> {
		return this.http.post(this.getApiUrl(path), new HttpParams({ fromObject: data }))
			.pipe(catchError(this.formatErrors))
	}
}