import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PsiCustomFormService } from './psi-custom-form.service';
import { environment } from 'src/environments/environment';

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
  isShowLoginErrorMsg:boolean = false;
  showErrorMsg: string;


  constructor(public readonly PsiCustomFormService: PsiCustomFormService) {
  }

  ngOnInit(): void {
  }

  onSubmit(form) {
    debugger
    if (form.valid) {
      let reqObj: any = {
        username: form.controls.userName.value,
        password: form.controls.password.value,
        token: null,
        email_verification_token:'',
        skip2fa: false
      };
      this.PsiCustomFormService.userLogin(reqObj).then((res) => {
        console.log(res);
        
        debugger
        if (!res.hasError) {
          window.location.href = environment.oldCockpit + '/router.php/dashboard';
        }
        
       else {
        debugger
        this.isShowLoginErrorMsg = true;
        this.showErrorMsg = res.msg
        }
      });
    }
  }
}



