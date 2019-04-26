import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LoginService } from '@pages/login/login.service';

@Component({
	selector: 'app-layout',
	templateUrl: './layout.component.html',
	styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private loginService: LoginService
	) {}

}
