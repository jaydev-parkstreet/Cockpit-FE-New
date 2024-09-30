import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-top-bar',
  templateUrl: './summary-top-bar.component.html',
  styleUrls: ['./summary-top-bar.component.scss']
})
export class SummaryTopBarComponent implements OnInit {
  topBarConfig : any;
  tooltipText:any;
  isFiltered = false; 
  dropdown1Label = 'Product Status';
  dropdown2Label = 'Product Type';  
  dropdown3Label = 'Product Sub-Type';
  dropdown4Label = 'Source';

  constructor() { }

  ngOnInit(): void {
    this.tooltipText = 'hello';
  }

  toggleFilter() {
    this.isFiltered = !this.isFiltered; 
  }

}
