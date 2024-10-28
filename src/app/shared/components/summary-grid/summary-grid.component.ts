import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnInit {

  @Input() gridOptions: any;

  constructor() { }

  ngOnInit(): void {
    
  }

}
