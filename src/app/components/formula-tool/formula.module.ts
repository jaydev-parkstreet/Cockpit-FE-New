import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaComponent } from './formula.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleModalModule } from 'ngx-simple-modal';
import { ConfirmationModalComponent } from '../organism/confirmation-modal/confirmation-modal.component';
import { StatelessModule } from 'src/app/stateless/stateless.module';
import { AgGridModule } from 'ag-grid-angular';
import { RouterModule } from '@angular/router';
import { FormulaRoutingModule } from './formula.routing.module';
import { FormulaDetailsComponent } from './formula-details/formula-details.component';
import { FsArchiveModalComponent } from './fs-archive-modal/fs-archive-modal.component';
import { FormulaCrudComponent } from './formula-crud/formula-crud.component';

@NgModule({
    declarations: [
        FormulaComponent,
        FormulaDetailsComponent,
        FsArchiveModalComponent,
        FormulaCrudComponent,
        
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
        StatelessModule,
        AgGridModule,
        RouterModule,
        FormulaRoutingModule,
        SimpleModalModule.forRoot({ container: "modal-container" })
    ],
    entryComponents: [
        ConfirmationModalComponent,
        FsArchiveModalComponent
    ],
    exports: []
})
export class FormulaSummaryModule { }
