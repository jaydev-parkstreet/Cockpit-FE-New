import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './product-management.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {

  constructor(private productManagementService:ProductManagementService) { }

  ngOnInit(): void {
    this.getSummary();
  }

  getSummary(){
    const token = localStorage.getItem('authToken');
    const summaryData = {
      "page": 1,
      "pageSize": 25,
      "sort": "status",
      "order": "asc"
    }
    this.productManagementService.getSummary(summaryData,token).then(response => {
      console.log(response);
    })
  }

}
