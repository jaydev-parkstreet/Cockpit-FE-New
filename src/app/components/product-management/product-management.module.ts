import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatelessModule } from 'src/app/stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ProductManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    StatelessModule,
    AgGridModule
  ],
  exports: []
})
export class ProductManagementModule { }
