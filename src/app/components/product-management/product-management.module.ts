import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductManagementComponent } from './product-management.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductAddComponent } from './product-add/product-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ConfirmationModalComponent } from '../organism/confirmation-modal/confirmation-modal.component';
import { StatelessModule } from 'src/app/stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [ProductManagementComponent, ProductAddComponent],
  providers: [{
    provide: ErrorHandler,
    useClass: ErrorHandler
  }],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    SimpleModalModule.forRoot({container: "modal-container"}),
    StatelessModule,
    AgGridModule
  ],
  entryComponents: [
   
    ConfirmationModalComponent,
  ],
  exports: [ ]
})
export class ProductManagementModule { }
