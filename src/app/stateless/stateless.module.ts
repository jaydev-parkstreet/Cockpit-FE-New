import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PsiAgGridComponent } from './psi-ag-grid/psi-ag-grid.component';
import { PsiEmptyMessageComponent } from './psi-empty-message/psi-empty-message.component';
@NgModule({
  declarations: [PsiAgGridComponent, PsiEmptyMessageComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PsiAgGridComponent,
    PsiEmptyMessageComponent
  ]
})
export class StatelessModule { }
