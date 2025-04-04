import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-audit-tab',
	templateUrl: './audit-tab.component.html',
	styleUrls: ['./audit-tab.component.scss']
})
export class AuditTabComponent implements OnInit {

	@Input() showLoader: boolean;
	@Input() auditList: any;
	@Input() rowObjectKeysDetail: any;

	constructor() { }

	ngOnInit(): void {
	}

	/**
	 * Toggles the visibility of the audit panel at the given index.
	 * @param index - The index of the audit panel to toggle.
	 * @author PSI-Enhancement
	 */
	setActivePanel(index) {
		this.auditList[index].show = !this.auditList[index].show;
	}

	/**
	 * Checks if the given type is in the list of excluded types.
	 * @param type
	 * @returns boolean
	 * @author PSI-Enhancement
	 */
	isExcludedType(type: string) {
		const excludedTypes = [
			'completed',
			'archived',
			'unarchived',
			'hold',
			'unhold',
			'change status',
			'set needs action by client on',
			'unset needs action by client on'
		];
		return excludedTypes.includes(type);
	}
}
