import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PsiCustomFormService } from './psi-custom-form.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import AppConstant from '../../../../../src/app/app.constant';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-psi-custom-form',
  templateUrl: './psi-custom-form.component.html',
  styleUrls: ['./psi-custom-form.component.scss']
})
export class PsiCustomFormComponent implements OnInit {
  @Input() showTitle: boolean;
  @Input() formTitle: any;
  @Input() formConfig: any;
  @Output() togglePasswordVisibility = new EventEmitter<any>();

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
    public router: Router,
    private authService: AuthService, private spinner: NgxSpinnerService
  ) { }

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
    this.spinner.show();
    try {
      const res = await this.PsiCustomFormService.userLogin(reqObj);
      if (!res.hasError) {
        const token = res.data.token;
        // localStorage.setItem('authToken', token);
        // const responce : any = await this.authService.selectClient(token);
        //  const tkn = responce.data.token;
        //  console.log("Inside",tkn);
        //   this.authService.login(tkn);
        const currentUserData = res.data;
        this.authService.login(token, currentUserData);
        await this.setSessionOldNavigatorSite(token).then(() => {
          // this.router.navigate(['/product-management']);
          // window.location.href = environment.oldCockpit + '/router.php/dashboard';
        });
        this.router.navigate(['/product-management']);
        // window.location.href = environment.oldCockpit + '/router.php/dashboard';
      } else {
        this.isShowLoginErrorMsg = true;
        this.showErrorMsg = res.msg;
      }
    } catch (error) {
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = error.error.msg;
    }
    finally {
      this.spinner.hide();
    }
  }

  setSessionOldNavigatorSite(token): Promise<void> {
    return new Promise((resolve, reject) => {
      const iframe = document.getElementById('myframe') as HTMLInputElement;
      iframe.src = environment.oldCockpit + '/router.php/set_session?jwt=' + token;
      iframe.onload = () => {
        resolve();
      };
    })
  }


  /**
  * Function to show and hide password.
  */
  togglePassword(index) {
    this.togglePasswordVisibility.emit(index);
  }

  /**
  Function so that the whole DOM is not re-rendered
  */
  trackByField(index: number, field: any): string {
    return field.name;
  }
}
