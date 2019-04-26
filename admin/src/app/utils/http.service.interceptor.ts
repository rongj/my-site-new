import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '@pages/login/login.service';

@Injectable()
export class HttpServiceInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private loginService: LoginService
	) {}

	intercept(req: HttpRequest < any > , next: HttpHandler): Observable<HttpEvent<any>> {
		const headersConfig = {
			'X-Requested-With': 'XMLHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		};
		const request = req.clone({ setHeaders: headersConfig, withCredentials: true  });
		return next.handle(request).pipe(
			tap((event: any) => {
				if (event instanceof HttpResponse && event.status === 200) {
					if(event.body.code === '1002') {
						this.loginService.redirectUrl = this.router.url;
						this.router.navigate(['/login']);
					}
				}
				// return Observable.create(observer => observer.next(event));
			})
		);
	}
}
