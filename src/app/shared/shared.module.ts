import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolComponent } from './components/header-tool/header-tool.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SummaryTopBarComponent } from './components/summary-top-bar/summary-top-bar.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { CmpButtonComponent } from './components/cmp-button/cmp-button.component';
import { TableComponent } from './templates/table/table.component';
import { StatelessModule } from '../stateless/stateless.module';
import { PsDefaultLinkComponent } from './components/ps-default-link/ps-default-link.component';
import { PsiActionButtonsComponent } from './components/psi-action-buttons/psi-action-buttons.component';
import { CmpHeaderWidgetComponent } from './components/cmp-header-widget/cmp-header-widget.component';
import { CardLayoutDetailsComponent } from './components/card-layout-details/card-layout-details.component';


@NgModule({
  declarations: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,
    ExcelExportComponent,
    CmpButtonComponent,
    TableComponent,
    PsDefaultLinkComponent,
    PsiActionButtonsComponent,
    CmpHeaderWidgetComponent,
    CardLayoutDetailsComponent
  ],
  imports: [
    CommonModule,
    StatelessModule
  ],
  exports: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,
    TableComponent,
    PsDefaultLinkComponent,
    PsiActionButtonsComponent,
    CmpHeaderWidgetComponent,
    CardLayoutDetailsComponent
  ]
})
export class SharedModule { }
