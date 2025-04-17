import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
@Component({
    selector: 'app-psi-crud-form',
    templateUrl: './psi-crud-form.component.html',
    styleUrls: ['./psi-crud-form.component.scss']
})
export class PsiCrudFormComponent implements OnInit, OnChanges {

    @Input() leftHeaderTitle: string;
    @Input() headerIconConfig: any;
    @Input() rightHeaderTitle: string;
    @Input() rightHeaderBottomTitle: string;
    @Input() crudFieldConfig: any;
    @Input() sellectedData: any;
    @Input() formSubmitted: boolean;
    @Input() form: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    @Output() formSubmit = new EventEmitter<any>();
    @Output() clearAllClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output() OnChangeDateModel = new EventEmitter<any>();
   
    // @Output() onFileDeleted = new EventEmitter<any>();
    @Input() set shouldClearAllFields(value: boolean) {
        if (value) {
            this.clearAllFields();
        }
    }

    showError: any;
    selectedFilesMap: { [key: string]: File[] } = {};



    constructor(
        public router: Router,
            private simpleModalService: SimpleModalService,
    ) { }

    ngOnInit(): void {
        this.showError = false
        this.formSubmitted = false
    }

    clearAllSelections(): void {
        const hasValues = [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].some((field) => {
            switch (field.type) {
                case 'multiselect-dropdown':
                case 'text':
                    return this.form?.get(field.name)?.value?.trim() !== '';
                case 'checkbox':
                    return this.form?.get(field.name)?.value === '1';
                default:
                    return false;
            }
        });
        if (!hasValues) { return; }
        this.clearAllClicked.emit();
    }

    clearAllFields(): void {
        if (!this.form || !this.crudFieldConfig) return;
        const clearField = (fieldName: string): void => {
            const control = this.form.get(fieldName);
            if (control) {
                control.setValue('');
                control.markAsPristine();
                control.markAsUntouched();
            }
        };
    
        [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].forEach((field) => {
            switch (field.type) {
                case 'multiselect-dropdown':
                    clearField(field.name);
                    this.sellectedData[field.key] = [];
                    break;
                case 'text':
                case 'checkbox':
                    clearField(field.name);
                    break;
                default:
                    break;
            }
        });
        this.form.updateValueAndValidity();
    }

    /**
     * Responds to changes in data-bound input properties.
     * @param changes
     * @author PSI-Enhancements
     */
    ngOnChanges(changes: SimpleChanges) {
    }

    /**
     * Emits an event when the state of a dropdown changes.
     * @param field
     * @param event
     * @author PSI-Enhancements
     */
    onDropdownStateChange(field, event) {
        this.onDropDownChange.emit({ field, event });
    }

    /**
     * Returns true if the field is invalid and the form has been submitted.
     * @param controlName
     * @returns boolean
     * @author PSI-Enhancements
     */
    isFieldInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    /**
     * Updates the form control value based on the input change.
     *
     * @param field
     * @param value
     * @author PSI-Enhancements
     */
    onInputChange(field, value) {
        this.form.get(field).setValue(value);
    }

    /**
     * Updates the form control value based on the checkbox state.
     *
     * @param field
     * @param isChecked
     * @author PSI-Enhancements
     */
    onCheckedInput(field, isChecked) {
        this.form.get(field)?.setValue(isChecked ? '1' : '0');
    }
  
    /**
     * Function to call on file upload.
     * @param event
     * @author PSI-Enhancements
     */
    changeFileUpload(value: File[], key: string) {
        this.selectedFilesMap[key] = value;
        this.form.get(key)?.setValue(value);
    }
}
