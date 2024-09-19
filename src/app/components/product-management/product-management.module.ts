import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ProductManagementComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: []
})
export class ProductManagementModule { }
