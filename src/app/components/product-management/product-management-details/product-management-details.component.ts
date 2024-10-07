import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-management-details',
  templateUrl: './product-management-details.component.html',
  styleUrls: ['./product-management-details.component.scss']
})
export class ProductManagementDetailsComponent implements OnInit {
  constructor() { }
  sync_status = 1;
  actionButtons : any = [
    {
      name:'Needs Action-Waiting on Supplier',
      class:'fas fa-clock',
      button: 'Needs Action-Waiting on Supplier'
    }, {
      name:'Pre-Approved',
      class:'fas fa-check-circle pointer',
      button: 'Pre-Approved',
    }, {
      name:'Approve',
      class:'fas fa-check-circle pointer',
      button: 'Approve'
    }, {
      name:'Edit',
      class:'fas fa-pen pointer',
      button: 'Edit'
    }, {
      name: "Clone",
      class: "fas fa-copy",
      button: "Duplicate",
    }
  ];
  
  ngOnInit(): void {
  }

}
