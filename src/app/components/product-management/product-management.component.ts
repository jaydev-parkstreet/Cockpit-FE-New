import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './product-management.service';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  summaryResponse:any;
  dropdownData:any;

  constructor(private productManagementService:ProductManagementService,
    private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.getSummary();
    this.getDropdown();
  }

  async getSummary(){
    const token = localStorage.getItem('authToken');
    const summaryData = {
      "page": 1,
      "pageSize": 25,
      "sort": "status",
      "order": "asc"
    }
    try {
      const response:any = await this.productManagementService.getSummary(summaryData,token);
      this.summaryResponse = response.data;
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
  }

  async getDropdown(){
    const token = localStorage.getItem('authToken');
    try {
      const response:any = await this.productManagementService.getDropdown(token);
      this.dropdownData = response.data;
      console.log(this.dropdownData)
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
  }


  logout () {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
