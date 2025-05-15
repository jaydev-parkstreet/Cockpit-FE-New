import { Component, Input, OnInit, Output, EventEmitter, ElementRef, Renderer2, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
export class PsiCustomFormComponent implements OnInit, AfterViewInit {
    @Input() showTitle: boolean;
    @Input() formTitle: any;
    @Input() formConfig: any;
    @Output() togglePasswordVisibility = new EventEmitter<any>();
    @ViewChildren('iconContainer') iconContainers!: QueryList<ElementRef>;
    @ViewChildren('inputElement') inputElements!: QueryList<ElementRef>;

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
    today: Date;
    lastValues: any = {
        userName: '',
        password: ''
    };

    constructor(
        public readonly PsiCustomFormService: PsiCustomFormService,
        public router: Router,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.today = new Date();
        this.loginForm.get('userName').valueChanges.subscribe(value => {
            this.recalculatePaddingIfNeeded('userName', value);
        });

        this.loginForm.get('password').valueChanges.subscribe(value => {
            this.recalculatePaddingIfNeeded('password', value);
        });
    }

    /**
     * Function to adjust padding.
     * @author PSI-Enhancements
     */
    ngAfterViewInit(): void {
        this.adjustInputPadding();
    }

    /**
     * Function to submit login form.
     * @param form
     * @author PSI-Enhancements
     */
    onSubmitLogin(form) {
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

    /**
     * Function to submit login form.
     * @param form
     * @author PSI-Enhancements
     */
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
                     window.location.href = environment.oldCockpit + '/router.php/dashboard';
                });
               // this.router.navigate(['/product-management']);
                // window.location.href = environment.oldCockpit + '/router.php/dashboard';
            } else {
                this.isShowLoginErrorMsg = true;
                this.showErrorMsg = res.msg;
                this.spinner.hide();

            }
        } catch (error) {
            this.isShowLoginErrorMsg = true;
            this.showErrorMsg = error.error.msg;
        }
        // finally {
        //     this.spinner.hide();
        // }
    }

    /**
     * Function to set session for old navigator.
     * @param form
     * @author PSI-Enhancements
     */
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
     * @param index
     * @author PSI-Enhancements
     */
    togglePassword(index) {
        this.togglePasswordVisibility.emit(index);
    }

    /**
     Function so that the whole DOM is not re-rendered
     * @param index
     * @author PSI-Enhancements
     */
    trackByField(index: number, field: any): string {
        return field.name;
    }

    /**
     Function to adjust padding
     * @param inputName
     * @author PSI-Enhancements
     */
    adjustInputPadding(inputName?: string) {
        if (this.iconContainers && this.inputElements) {
            const iconContainersArray = this.iconContainers.toArray();
            const inputElementsArray = this.inputElements.toArray();
            const extraPadding = 8;
            inputElementsArray.forEach((inputElement, index) => {
                const iconContainer = iconContainersArray[index];
                const inputElementName = inputElement.nativeElement.name;
                if ((inputElement && iconContainer) && (!inputName || inputName === inputElementName)) {
                    const iconContainerWidth = iconContainer.nativeElement.offsetWidth;
                    const topPadding = inputElement.nativeElement.style.paddingTop || '12px';
                    const bottomPadding = inputElement.nativeElement.style.paddingBottom || '12px';
                    const leftPadding = inputElement.nativeElement.style.paddingLeft || '12px';
                    this.renderer.setStyle(inputElement.nativeElement, 'padding', `${topPadding} ${iconContainerWidth + extraPadding}px ${bottomPadding} ${leftPadding}`);
                }
            });
        }
    }

    /**
     Function to clear Input
     * @param fieldName
     * @author PSI-Enhancements
     */
    clearInput(fieldName: string): void {
        this.loginForm.get(fieldName)?.setValue('');
    }

    /**
     Function to Recalculate Padding If Needed
     * @param fieldName
     * @author PSI-Enhancements
     */
    recalculatePaddingIfNeeded(field: string, value: string) {
        if (this.lastValues[field] === '') {
            setTimeout(() => {
                this.adjustInputPadding(field);
            });
            this.lastValues[field] = value;
        }
    }
}
