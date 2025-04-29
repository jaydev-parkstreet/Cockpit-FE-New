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
    @Input() selectedFiles: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    @Output() formSubmit = new EventEmitter<any>();
    @Output() clearAllClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output() OnChangeDateModel = new EventEmitter<any>();
    isDisable: boolean;
    @Output() checkboxToggled = new EventEmitter<{ field: string, isChecked: boolean }>();
    @Output() fileUploadTriggered = new EventEmitter<{ files: File[], fieldName: string, uploadType: string }>();
    selectedOption: any;

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
                    return (this.form?.get(field.name)?.value ?? '').trim() !== '';
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
        if (field?.isExpiration !== false) {
            this.checkboxToggled.emit({ field, isChecked });
        }
    }

    /**
     * Function to call on file upload.
     * @param event
     * @author PSI-Enhancements
     */
    changeFileUpload(files: File[], fieldName: string): void {
        if (!files || files.length === 0) {
            return;
        }

        this.selectedFilesMap[fieldName] = files;
        const allFields = [...(this.crudFieldConfig?.leftSection || []), ...(this.crudFieldConfig?.rightSection || [])];
        const fieldConfig = allFields.find(f => f.key === fieldName);
        const isFileUpload = fieldConfig?.isFileUpload ?? false;
        if (isFileUpload) {
            const typeMap = {
                'formula_fids_id': 'Fidsdoc',
                'formula_loi_id': 'Lisddoc',
                'formula_mom_id': 'Mmdoc',
                'formula_approval_id': 'Appdoc',
            };
            const uploadType = typeMap[fieldName];
            if (uploadType) {
                this.fileUploadTriggered.emit({ files, fieldName, uploadType });
            }
        }
    }

    /**
     * Function to call on radio change.
     * @param event
     * @author PSI-Enhancements
     */
    changeRadioButton(value: any, field: any): void {
        this.form.get(field.key)?.setValue(value);

        if (field?.isProductOrigin !== false) {
            this.selectedOption = value;
            if (field.name === 'product_origin' || field.name === 'classification') {
                this.form.get('product_type')?.setValue(null);
                this.sellectedData['product_type'] = [];
                this.form.get('classification')?.setValue(null);
                this.sellectedData['classification'] = [];
            }
        }
    }
    /**
     * Function to call on date change.
     * @author PSI-VIII
     * @param fieldName
     * @param event
     */
    onDateChangedInForm(fieldName: string, event: { type: string; value: Date | null }) {
        this.form.get(fieldName)?.setValue(event.value);
    }
}
