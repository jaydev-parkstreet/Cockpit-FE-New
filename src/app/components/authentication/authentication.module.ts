import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { PsiCustomFormComponent } from './psi-custom-form/psi-custom-form.component';
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		LoginPageComponent,
		PsiCustomFormComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SharedModule
	],
	exports: [
		LoginPageComponent,
		PsiCustomFormComponent
	]
})
export class AuthenticationModule { }
