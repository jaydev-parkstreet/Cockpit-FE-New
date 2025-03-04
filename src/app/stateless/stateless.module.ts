import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiCrudFormComponent } from '../shared/psi-crud-form/psi-crud-form.component';
import { PsiPageColumnHeaderComponent } from './psi-page-column-header/psi-page-column-header.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiPageColumnHeaderComponent
  ]
})
export class StatelessModule { }
