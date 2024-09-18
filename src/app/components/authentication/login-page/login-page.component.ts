import { Component, OnInit } from '@angular/core';
import AppConstant from '../../../../../src/app/app.constant';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  title: any;
  formConfig: any;

  constructor() { }

  ngOnInit(): void {
    this.title = {
      firstline: AppConstant.LOGIN.PAGE_TITLE,
      secondline: AppConstant.LOGIN.PAGE_SUBTITLE
    };
    this.formConfig = {
      schema: [
        { type: 'text', name: 'userName', label: 'Email OR Username', placeholder: 'Email or Username', required: true },
        { type: 'password', name: 'password', label: 'Password', placeholder: 'Password', required: true }
      ],
      submitBtnLabel: AppConstant.LOGIN.BUTTON_LABEL,
      socialButton: true,
      separatorText: 'OR',
      footerNotes: AppConstant.LOGIN.NOTES
    };
  }

}
