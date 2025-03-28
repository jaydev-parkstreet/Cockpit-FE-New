import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-cmp-tab-group',
	templateUrl: './cmp-tab-group.component.html',
	styleUrls: ['./cmp-tab-group.component.scss']
})
export class CmpTabGroupComponent implements OnInit {
	@Input() tabGroupConfig: Array<{ key: string; label: string }>;
	@Input() activeTab: string;
	@Output() tabClick = new EventEmitter<{ tab: any }>();
	constructor() { }

	clickOnTab(tab: any) {
		this.tabClick.emit(tab);
	}

	ngOnInit(): void {
	}

}
