import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from './core/services/common.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'COCKPIT-FE';

	constructor(
		private spinner: NgxSpinnerService,
		public commonService: CommonService,
		private router: Router
	) { }

	ngOnInit() {
		const loggedIn = localStorage.getItem('authToken');
		if (!loggedIn) {
			this.router.navigate(['/login']);
		}
	}
}
