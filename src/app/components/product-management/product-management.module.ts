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
import { ProductManagementDetailsComponent } from './product-management-details/product-management-details.component';
import { NotesTabComponent } from '../organism/notes-tab/notes-tab.component';
import { RouterModule } from '@angular/router';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { AttachmentTabComponent } from '../organism/attachment-tab/attachment-tab.component';
import { MassUploadExcelModalComponent } from './mass-upload-excel-modal/mass-upload-excel-modal.component';
import { AuditTabComponent } from '../organism/audit-tab/audit-tab.component';


@NgModule({
    declarations: [
        ProductManagementComponent,
        ProductAddComponent,
        ProductManagementDetailsComponent,
        NotesTabComponent,
        AttachmentTabComponent,
        MassUploadExcelModalComponent,
        AuditTabComponent
    ],
    providers: [{
        provide: ErrorHandler,
        useClass: ErrorHandler
    }],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule,
        SimpleModalModule.forRoot({ container: "modal-container" }),
        StatelessModule,
        AgGridModule,
        RouterModule,
        ProductManagementRoutingModule
    ],
    entryComponents: [
        ConfirmationModalComponent,
    ],
    exports: []
})
export class ProductManagementModule { }
