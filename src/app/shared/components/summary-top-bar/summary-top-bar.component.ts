import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-top-bar',
  templateUrl: './summary-top-bar.component.html',
  styleUrls: ['./summary-top-bar.component.scss']
})
export class SummaryTopBarComponent implements OnInit {
  topBarConfig : any;
  tooltipText:any;

  constructor() { }

  ngOnInit(): void {
    this.tooltipText = 'hello';
  }

}
