import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolComponent } from './components/header-tool/header-tool.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SummaryTopBarComponent } from './components/summary-top-bar/summary-top-bar.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';




@NgModule({
  declarations: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,
    ExcelExportComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent
  ]
})
export class SharedModule { }
