import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.tooltipText = 'hello';
  }

  toggleFilter() {
    this.isFiltered = !this.isFiltered; 
}
   addProduct() {
    this.router.navigate(['/product-management/add']); 
}

}
