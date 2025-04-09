import { Component, Input, OnInit, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
@Component({
	selector: 'app-cmp-summary-top-box',
	templateUrl: './cmp-summary-top-box.component.html',
	styleUrls: ['./cmp-summary-top-box.component.scss']
})
export class CmpSummaryTopBoxComponent implements OnInit {
	@ViewChild('summaryBoxContainer') summaryBoxContainer: ElementRef;
	@Output() onValueClick: EventEmitter<any> = new EventEmitter();
	@Input() summaryBoxData: any;
	@Input() cardToDisplay: number;
	summaryBoxDataLength: number;
	curPage: number;
	isExpanded: boolean;
	cardMinWidth: string;
	SummaryData: any[] = [];

	constructor() { }

	ngOnInit(): void {
		this.curPage = 0;
		this.cardToDisplay = this.cardToDisplay ? this.cardToDisplay : 3;
		this.summaryBoxDataLength = this.summaryBoxData.length;
		this.updateCardMinWidth();
		this.getsummaryBoxData();
	}

	/**
	 * Function to map summaryBoxData for pagination
	 * @author PSI-Enhancement
	 */
	getsummaryBoxData() {
		const startIndex = this.curPage;
		this.SummaryData = this.summaryBoxData.slice(startIndex, startIndex + this.cardToDisplay);
	}


	/**
	 * Function to handle the click event of the back and forward click
	 * @author PSI-Enhancement
	 * @param back
	 * @param forward
	 */
	scrollCarousel(back: string, forward: string) {
		if (back && this.curPage > 0) {
			this.curPage = this.curPage - 1;
		}
		if (forward && this.curPage < this.summaryBoxDataLength - this.cardToDisplay) {
			this.curPage = this.curPage + 1;
		}
		this.getsummaryBoxData();
	}

	/**
	 * Function to calculate the width of card
	 * @author PSI-Enhancement
	 */
	updateCardMinWidth(): void {
		let width = window.innerWidth;
		if (width < 768) {
			this.cardMinWidth = '100%';
		} else {
			let calculatedWidth = Math.floor(100 / this.cardToDisplay);
			calculatedWidth -= 2;
			this.cardMinWidth = calculatedWidth > 0 ? calculatedWidth + '%' : '0%';
		}
	}

	clickOnRowValue(row) {
		this.onValueClick.emit(row);
	}
}
