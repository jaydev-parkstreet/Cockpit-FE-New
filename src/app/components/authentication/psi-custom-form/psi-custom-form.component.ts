import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-psi-custom-form',
  templateUrl: './psi-custom-form.component.html',
  styleUrls: ['./psi-custom-form.component.scss']
})
export class PsiCustomFormComponent implements OnInit {
  loginForm = new FormGroup({
    userName : new FormControl('',[Validators.required]),
    password : new FormControl('',[
      Validators.required,
      Validators.minLength(6)
    ]),
  });
  formSubmitted: boolean;
  bothInvalid : boolean;
  

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(){
    debugger
    this.formSubmitted = true;

  if (this.loginForm.invalid) {
    // this.bothInvalid = true;
    // (this.loginForm.controls.userName.status === 'INVALID' && this.loginForm.controls.password.status === 'INVALID'){


    // }
    // this.loginForm.markAllAsTouched();
    return;
  }
  }

}
