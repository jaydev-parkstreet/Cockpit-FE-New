import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-psi-custom-form',
  templateUrl: './psi-custom-form.component.html',
  styleUrls: ['./psi-custom-form.component.scss']
})
export class PsiCustomFormComponent implements OnInit {
  loginForm = new FormGroup({
    userName : new FormControl(''),
    password : new FormControl(''),
  })
  

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(){
    console.log("formSubmit",this.loginForm.value);
  }

}
