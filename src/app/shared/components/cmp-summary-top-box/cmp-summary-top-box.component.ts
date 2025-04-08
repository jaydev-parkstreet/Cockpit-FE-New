import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
@Component({
	selector: 'app-cmp-summary-top-box',
	templateUrl: './cmp-summary-top-box.component.html',
	styleUrls: ['./cmp-summary-top-box.component.scss']
})
export class CmpSummaryTopBoxComponent implements OnInit {
	@ViewChild('summaryBoxContainer') summaryBoxContainer: ElementRef;
	@Input() summaryBoxData: any;
	@Input() cardToDisplay: number;
	summaryBoxDataLength: number;
	curPage: number;
	isExpanded: boolean;
	cardMinWidth: string;


	constructor() { }

	ngOnInit(): void {
		this.curPage = 0;
		this.cardToDisplay = this.cardToDisplay ? this.cardToDisplay : 3;

		this.summaryBoxDataLength = this.summaryBoxData.length;
		this.isExpanded = true;

		this.updateCardMinWidth();
	}

	
	get paginatedData() {
		const startIndex = this.curPage * this.cardToDisplay;
		return this.summaryBoxData.slice(startIndex, startIndex + this.cardToDisplay);
	}

	// scrollCarousel(back: string, forward: string) {
	// 	if (back && this.curPage > 0) {
	// 		this.curPage = this.curPage - 1;
	// 	}
	// 	if (forward && this.curPage < this.summaryBoxDataLength - this.cardToDisplay) {
	// 		this.curPage = this.curPage + 1;
	// 	}
	// }

	scrollCarousel(back: string, forward: string) {
		debugger
		console.log(`Current Page: ${this.curPage}, Data Length: ${this.summaryBoxDataLength}, Cards to Display: ${this.cardToDisplay}`);

		// Backward scrolling (previous)
		if (back && this.curPage > 0) {
			this.curPage = this.curPage - 1;
			console.log(`Scrolling Backward: New Page ${this.curPage}`);
		}

		// Forward scrolling (next)
		if (forward && this.curPage < this.summaryBoxDataLength - this.cardToDisplay) {
			this.curPage = this.curPage + 1;
			console.log(`Scrolling Forward: New Page ${this.curPage}`);
		}
	}
	  

	//   updateCardMinWidth(): void {
	//     if (window.innerWidth < 768) {
	//       this.cardMinWidth = '100%';
	//     } else {
	//       this.cardMinWidth = Math.floor(100 / this.cardToDisplay) + '%';
	//     }
	//   }

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


}
