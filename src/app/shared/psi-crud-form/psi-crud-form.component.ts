import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'app-psi-crud-form',
    templateUrl: './psi-crud-form.component.html',
    styleUrls: ['./psi-crud-form.component.scss']
})
export class PsiCrudFormComponent implements OnInit, OnChanges {

    @Input() leftHeaderTitle: string;
    @Input() rightHeaderTitle: string;
    @Input() rightHeaderBottomTitle: string;
    @Input() crudFieldConfig: any;
    @Input() sellectedData: any;
    @Input() form: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    showError: any;
    formSubmitted: any;
    @Output() formSubmit = new EventEmitter<any>();

    constructor(
        private simpleModalService: SimpleModalService,
        public router: Router
    ) { }
    ngOnInit(): void {
        this.showError = false
        this.formSubmitted = false
    }

    ngOnChanges(changes: SimpleChanges) {
    }
    onDropdownStateChange(field, event) {
        this.onDropDownChange.emit({ field, event });
    }

    isFieldInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.formSubmitted;
    }
    onButtonClicked(event) {
        if (event === "Submit") {
            this.formSubmitted = true
            this.formSubmit.emit(this.form);
        }
        if (event === "Cancel") {
            this.openConfirmationPopup()
        }
    }
    openConfirmationPopup() {
        let modalData;

        modalData = {
            title: 'All data will be lost.',
            body: 'Are you sure you wish to exit?',
            closeBtnName: 'No',
            confirmBtnName: 'Yes',
            iconClass: 'fas fa-exclamation-circle error',
            showLine: true,
        };

        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result.confirm) {
                    this.router.navigate(["/product-management"])
                }
            });
    }

    onInputChange(field, value) {
        this.form.get(field).setValue(value);
    }

    onCheckedInput(field, isChecked) {
        console.log(field, isChecked);
        this.form.get(field)?.setValue(isChecked ? '1' : '0');
    }
}
