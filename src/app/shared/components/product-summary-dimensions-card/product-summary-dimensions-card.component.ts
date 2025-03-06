import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-summary-dimensions-card',
  templateUrl: './product-summary-dimensions-card.component.html',
  styleUrls: ['./product-summary-dimensions-card.component.scss']
})
export class ProductSummaryDimensionsCardComponent implements OnInit {
  @Input() rows: any;
  @Input() cardClass: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
