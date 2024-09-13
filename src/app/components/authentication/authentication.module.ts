import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { PsiCustomFormComponent } from './psi-custom-form/psi-custom-form.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    PsiCustomFormComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoginPageComponent,
    PsiCustomFormComponent
  ]
})
export class AuthenticationModule { }
