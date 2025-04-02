import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { summaryComponent } from './summary.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ConfirmationModalComponent } from '../organism/confirmation-modal/confirmation-modal.component';
import { StatelessModule } from 'src/app/stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { SummaryRoutingModule } from './summary.routing.module';


@NgModule({
    declarations: [
        summaryComponent,
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
        SummaryRoutingModule
    ],
    entryComponents: [
        ConfirmationModalComponent,
    ],
    exports: []
})
export class SummaryModule { }
