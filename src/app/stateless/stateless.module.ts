import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiPageColumnHeaderComponent } from './psi-page-column-header/psi-page-column-header.component';
import { PsiInputTextFieldComponent } from './psi-input-text-field/psi-input-text-field.component';
import { PsiCheckboxComponent } from './psi-checkbox/psi-checkbox.component';
import { PsDetailsComponent } from './ps-details/ps-details.component';



@NgModule({
  declarations: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent,
    PsiCheckboxComponent,
    PsDetailsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent,
    PsiInputTextFieldComponent,
    PsiCheckboxComponent,
    PsDetailsComponent
  ]
})
export class StatelessModule { }
