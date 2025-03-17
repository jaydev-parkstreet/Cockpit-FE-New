import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiEmptyMessageComponent } from './psi-empty-message/psi-empty-message.component';
import { PsiPageColumnHeaderComponent } from './psi-page-column-header/psi-page-column-header.component';
import { PsiInputTextFieldComponent } from './psi-input-text-field/psi-input-text-field.component';
import { PsiCheckboxComponent } from './psi-checkbox/psi-checkbox.component';



@NgModule({
  declarations: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent,
    PsiCheckboxComponent,
    PsiEmptyMessageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent,
    PsiCheckboxComponent,
    PsiEmptyMessageComponent
  ]
})
export class StatelessModule { }
