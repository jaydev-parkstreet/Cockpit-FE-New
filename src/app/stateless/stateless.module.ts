import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiCrudFormComponent } from './psi-crud-form/psi-crud-form.component';
import { PsiPageColumnHeaderComponent } from './psi-page-column-header/psi-page-column-header.component';



@NgModule({
  declarations: [
    PsiAgGridComponent,
    PsiCrudFormComponent,
    PsiPageColumnHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiCrudFormComponent,
    PsiPageColumnHeaderComponent
  ]
})
export class StatelessModule { }
