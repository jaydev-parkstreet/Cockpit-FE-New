import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { PsiCustomFormComponent } from './psi-custom-form/psi-custom-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MiddleComponent } from './middle/middle.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    PsiCustomFormComponent,
    MiddleComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginPageComponent,
    PsiCustomFormComponent,
    MiddleComponent
  ]
})
export class AuthenticationModule { }
