import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatelessModule } from 'src/app/stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';
import { ProductManagementDetailsComponent } from './product-management-details/product-management-details.component';


@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductManagementDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    StatelessModule,
    AgGridModule
  ],
  exports: []
})
export class ProductManagementModule { }
