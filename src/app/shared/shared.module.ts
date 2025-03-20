import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolComponent } from './components/header-tool/header-tool.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SummaryTopBarComponent } from './components/summary-top-bar/summary-top-bar.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { CmpButtonComponent } from './components/cmp-button/cmp-button.component';
import { CmpInputDropdownComponent } from './components/cmp-input-dropdown/cmp-input-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmpCheckboxComponent } from './components/cmp-checkbox/cmp-checkbox.component';
import { StatelessModule } from '../stateless/stateless.module';
import { PsDefaultLinkComponent } from './components/ps-default-link/ps-default-link.component';
import { PsiActionButtonsComponent } from './components/psi-action-buttons/psi-action-buttons.component';
import { CmpHeaderWidgetComponent } from './components/cmp-header-widget/cmp-header-widget.component';
import { CardLayoutDetailsComponent } from './components/card-layout-details/card-layout-details.component';
import { ProductSummaryDimensionsCardComponent } from './components/product-summary-dimensions-card/product-summary-dimensions-card.component';
import { CmpTabGroupComponent } from './components/cmp-tab-group/cmp-tab-group.component';
import { SummaryGridComponent } from './components/summary-grid/summary-grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { CmpAttachmentModalComponent } from './components/cmp-attachment-modal/cmp-attachment-modal.component'
import { PsiCrudFormComponent } from './psi-crud-form/psi-crud-form.component';
import { NoRecordComponent } from './components/no-record/no-record.component';


@NgModule({
  declarations: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,
    ExcelExportComponent,
    CmpButtonComponent,
    CmpInputDropdownComponent,
    CmpCheckboxComponent,  
    PsDefaultLinkComponent,
    PsiActionButtonsComponent,
    CmpHeaderWidgetComponent,
    CardLayoutDetailsComponent,
    ProductSummaryDimensionsCardComponent,
    CmpTabGroupComponent,
    SummaryGridComponent,
    CmpAttachmentModalComponent,
    PsiCrudFormComponent,
    NoRecordComponent,
  
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    StatelessModule,
    AgGridModule
  ],
 
  exports: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,  
    CmpInputDropdownComponent, 
    CmpCheckboxComponent,  
    SummaryTopBarComponent,
    PsDefaultLinkComponent,
    PsiActionButtonsComponent,
    CmpHeaderWidgetComponent,
    CardLayoutDetailsComponent,
    ProductSummaryDimensionsCardComponent,
    CmpTabGroupComponent,
    SummaryGridComponent,
    CmpButtonComponent,
    PsiCrudFormComponent,
    NoRecordComponent
  ]
})
export class SharedModule { }
