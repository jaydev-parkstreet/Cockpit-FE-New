import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
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
    @Input() clearAll: boolean;
    @Input() rightHeaderTitle: string;
    @Input() rightHeaderBottomTitle: string;
    @Input() crudFieldConfig: any;
    @Input() sellectedData: any;
    @Input() formSubmitted: boolean;
    @Input() form: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    showError: any;
    @Output() formSubmit = new EventEmitter<any>();

    constructor(
        public router: Router,
            private simpleModalService: SimpleModalService,
    ) { }

    ngOnInit(): void {
        this.showError = false
        this.formSubmitted = false
    }

    /**
     * Responds to changes in data-bound input properties.
     * @param changes
     * @author psi-enhancement
     */
    ngOnChanges(changes: SimpleChanges) {
    }

    /**
     * Emits an event when the state of a dropdown changes.
     * @param field
     * @param event
     * @author psi-enhancement
     */
    onDropdownStateChange(field, event) {
        this.onDropDownChange.emit({ field, event });
    }

    /**
     * Returns true if the field is invalid and the form has been submitted.
     * @param controlName
     * @returns boolean
     * @author psi-enhancement
     */
    isFieldInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    /**
     * Function of clear the form
     * @author psi-enhancement
     */
    clearAllSelections(): void {
        const hasValues = [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].some((field) => {
            if (field.type === 'multiselect-dropdown' && this.sellectedData[field.key]?.length > 0) {
                return true;
            }
            if (field.type === 'text' && this.form?.get(field.name)?.value?.trim() !== '') {
                return true;
            }
            if (field.type === 'checkbox' && this.form?.get(field.name)?.value === '1') {
                return true;
            }
            return false;
        });

        if (!hasValues) { return; }

        const modalData = {
            title: 'All data will be lost.',
            body: 'Are you sure you wish to clear all fields?',
            iconClass: 'fas fa-exclamation-circle error',
            btnLabel: [
                { type: 'Btn', label: 'No', class: 'secondary' },
                { type: 'Btn', label: 'Yes', class: 'primary' }
            ]
        };

        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData }).subscribe((result) => {
            if (result.btn.label === 'Yes') {
                [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].forEach((field) => {

                    if (field.type === 'multiselect-dropdown') {
                        this.sellectedData[field.key] = [];
                    }

                    if (field.type === 'text' && this.form?.get(field.name)) {
                        this.form.get(field.name).setValue('');
                        this.form.get(field.name).markAsPristine();
                        this.form.get(field.name).markAsUntouched();
                    }

                    if (field.type === 'checkbox' && this.form?.get(field.name)) {
                        this.form.get(field.name).setValue('');
                        this.form.get(field.name).markAsPristine();
                        this.form.get(field.name).markAsUntouched();
                    }
                });

                if (this.form) {
                    this.form.updateValueAndValidity();
                }
            }
        });
    } 

    /**
     * Updates the form control value based on the input change.
     *
     * @param field
     * @param value
     * @author psi-enhancement
     */
    onInputChange(field, value) {
        this.form.get(field).setValue(value);
    }

    /**
     * Updates the form control value based on the checkbox state.
     *
     * @param field
     * @param isChecked
     * @author psi-enhancement
     */
    onCheckedInput(field, isChecked) {
        this.form.get(field)?.setValue(isChecked ? '1' : '0');
    }
}
