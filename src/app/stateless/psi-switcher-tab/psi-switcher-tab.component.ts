import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

export interface TabItem {
	key: string;
	label: string;
	isDisable?: boolean;
}

@Component({
	selector: 'app-psi-switcher-tab',
	templateUrl: './psi-switcher-tab.component.html',
	styleUrls: ['./psi-switcher-tab.component.scss']
})
export class PsiSwitcherTabComponent implements OnInit {

	@Input() tabsConfig: TabItem[] = [];
	@Input() activeTab: string = '';
	@Input() isActiveTab?: string;
	@Output() tabSelected = new EventEmitter<string>();

	constructor() { }

	ngOnInit(): void { }


   	/**
     * Function to check active tab.
     * @param tabKey
     * @author PSI-Enhancement
     */
	isTabActive(tabKey: string) {
		return this.isActiveTab ? this.isActiveTab === tabKey : this.activeTab === tabKey;
	}

	/**
     * Function to handle on click function on tab .
     * @param tabKey
     * @author PSI-Enhancement
     */
	onTabClick(tab: TabItem): void {
		if (tab?.isDisable) {
			return;
		}

		if (!this.isActiveTab) {
			this.activeTab = tab.key;
		}

		this.tabSelected.emit(tab.key);
	}
}
