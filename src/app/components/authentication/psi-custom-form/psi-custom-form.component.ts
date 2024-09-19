import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PsiCustomFormService } from './psi-custom-form.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import AppConstant from '../../../../../src/app/app.constant';

@Component({
  selector: 'app-psi-custom-form',
  templateUrl: './psi-custom-form.component.html',
  styleUrls: ['./psi-custom-form.component.scss']
})
export class PsiCustomFormComponent implements OnInit {
  @Input() showTitle: boolean;
  @Input() formTitle: any;
  @Input() formConfig: any;

  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });
  formSubmitted: boolean = false;
  bothInvalid: boolean = false;
  isShowLoginErrorMsg: boolean = false;
  showErrorMsg: string = '';

  constructor(
    public readonly PsiCustomFormService: PsiCustomFormService,
    public router: Router) { }

  ngOnInit(): void { }

  onSubmit(form) {
    this.formSubmitted = true;
    if (!form.controls['userName'].value && form.controls['password'].value) {
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = AppConstant.LOGIN.REQUIRED_EMAIL;
    } else if (form.controls['userName'].value && !form.controls['password'].value) {
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = AppConstant.LOGIN.REQUIRED_PASSWORD;
    } else if (form.controls['userName'].invalid && form.controls['password'].invalid) {
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = AppConstant.LOGIN.REQUIRED_FIELDS;
    } else {
      this.isShowLoginErrorMsg = false;
      this.showErrorMsg = '';
      if (form.valid) {
        let reqObj: any = {
          username: form.controls.userName.value,
          password: form.controls.password.value,
          token: null,
          email_verification_token: '',
          skip2fa: false
        };
        this.userLoginHandler(reqObj);
      }
    }
  }

  async userLoginHandler(reqObj) {
    try {
      const res = await this.PsiCustomFormService.userLogin(reqObj);
      if (!res.hasError) {
        this.setSessionOldNavigatorSite(res.data.token);
        this.router.navigate(['/ProductManagementComponent']);
        //window.location.href = environment.oldCockpit + '/router.php/dashboard';
      } else {
        this.isShowLoginErrorMsg = true;
        this.showErrorMsg = res.msg;
      }
    } catch (error) {
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = error.error.msg;
    }
  }

  setSessionOldNavigatorSite(token) {
    const iframe = document.getElementById('myframe') as HTMLInputElement;
    iframe.src = environment.oldCockpit + '/router.php/set_session?jwt=' + token;
  }
}
