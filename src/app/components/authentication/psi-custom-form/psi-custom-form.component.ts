import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-psi-custom-form',
  templateUrl: './psi-custom-form.component.html',
  styleUrls: ['./psi-custom-form.component.scss']
})
export class PsiCustomFormComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
  });
  formSubmitted: boolean;
  bothInvalid: boolean;


  constructor() { }

  ngOnInit(): void {
  }
  // onSubmit(){
  // this.formSubmitted = true;
  // console.log(this.loginForm.value.password !=='' && this.loginForm.value.userName !=='' )

  // if (this.loginForm.invalid) {

  // return;
  // }

  onSubmit(form) {
    if (form.valid) {
      // this.usSpinnerService.spin('app-loader');
      // this.formConfig.serverValidation = '';
      // let reqObj: any = {
      //   username: this.user.email,
      //   password: this.user.password,
      //   token: this.token,
      //   email_verification_token: this.emailVerificationToken,
      //   skip2fa: false
      // };
      // if (this.commonService.getURLParameter('compeId')) {
      //   reqObj.is_competition_req = true;
      //   reqObj.competition_id = this.commonService.getURLParameter('compeId');
      // }
      // this.loginService.userLogin(reqObj).then((response) => {
      //   this.processResponseAfterLogin(response);
      //   this.usSpinnerService.stop('app-loader');
      // });
    }
  }
}



