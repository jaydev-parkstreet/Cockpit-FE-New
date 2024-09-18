import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PsiCustomFormService } from './psi-custom-form.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
  isShowLoginErrorMsg: boolean = false;
  showErrorMsg: string;


  constructor(public readonly PsiCustomFormService: PsiCustomFormService,public router: Router) {
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
        email_verification_token: '',
        skip2fa: false
      };
      this.userLoginHandler(reqObj);
      // this.PsiCustomFormService.userLogin(reqObj).then((res) => {
      //   console.log(res);
      //   debugger
      //   if (!res.hasError) {
      //     window.location.href = environment.oldCockpit + '/router.php/dashboard';
      //   } else {
      //     debugger
      //     console.log(this.isShowLoginErrorMsg);
      //     this.isShowLoginErrorMsg = true;
      //     this.showErrorMsg = res.msg
      //   }
      // });
      
    }
  }

  async userLoginHandler(reqObj) {
    try {
      const res = await this.PsiCustomFormService.userLogin(reqObj);
      
      if (!res.hasError) {
        // window.location.href = environment.oldCockpit + '/router.php/dashboard';

        this.setSessionOldNavigatorSite(res.data.token);
        setTimeout(() => {
          console.log("redirecttion to middle component" );
          
        }, 3000);
          this.router.navigate(['/middle']);
          console.log(this.router);
         
        
      } else {
        this.isShowLoginErrorMsg = true;
        // this.showErrorMsg = res.msg;
      }
    } catch (error) {
      debugger
      // Catch any errors from the API call (such as 404 or network errors)
      console.error('Error in API call:', error);
      this.isShowLoginErrorMsg = true;
      this.showErrorMsg = error.error.msg;
    }
  }

  setSessionOldNavigatorSite(token) {
    const iframe = document.getElementById('myframe') as HTMLInputElement;
    iframe.src =
        'http://cockpit.parkstreet.local' + '/router.php/set_session?jwt=' + token;
    }
    
  
}



