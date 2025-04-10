import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-psi-step-progress-bar',
	templateUrl: './psi-step-progress-bar.component.html',
	styleUrls: ['./psi-step-progress-bar.component.scss']
})
export class PsiStepProgressBarComponent implements OnInit {
	@Input() step: number = 0;
	@Input() data: Array<{ id: number, label: string }> = [];

	constructor() { }

	ngOnInit(): void {
	}

}
