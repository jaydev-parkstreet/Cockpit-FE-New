import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolComponent } from './components/header-tool/header-tool.component';




@NgModule({
  declarations: [
    HeaderToolComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    HeaderToolComponent
  ]
})
export class SharedModule { }
