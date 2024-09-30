import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolComponent } from './components/header-tool/header-tool.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SummaryTopBarComponent } from './components/summary-top-bar/summary-top-bar.component';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { CmpButtonComponent } from './components/cmp-button/cmp-button.component';
import { CmpInputDropdownComponent } from './components/cmp-input-dropdown/cmp-input-dropdown.component';


@NgModule({
  declarations: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent,
    ExcelExportComponent,
    CmpButtonComponent,
    CmpInputDropdownComponent,    
  ],
  imports: [
    CommonModule,

  ],
  exports: [
    HeaderToolComponent,
    SearchBarComponent,
    SummaryTopBarComponent
  ]
})
export class SharedModule { }
