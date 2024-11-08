import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';



@NgModule({
  declarations: [PsiAgGridComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent
  ]
})
export class StatelessModule { }
