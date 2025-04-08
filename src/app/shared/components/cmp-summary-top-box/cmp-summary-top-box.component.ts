import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-cmp-summary-top-box',
	templateUrl: './cmp-summary-top-box.component.html',
	styleUrls: ['./cmp-summary-top-box.component.scss']
})
export class CmpSummaryTopBoxComponent implements OnInit {
	@Input() summaryBoxData: any;

	constructor() { }

	ngOnInit(): void {
	}

}
