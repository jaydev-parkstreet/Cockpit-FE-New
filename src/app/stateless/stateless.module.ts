import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiPageColumnHeaderComponent } from './psi-page-column-header/psi-page-column-header.component';
import { PsiInputTextFieldComponent } from './psi-input-text-field/psi-input-text-field.component';



@NgModule({
  declarations: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent
  ]
})
export class StatelessModule { }
