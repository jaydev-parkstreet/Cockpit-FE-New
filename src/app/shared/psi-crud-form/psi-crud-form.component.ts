import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
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
    @Input() formSubmitted: boolean;
    @Input() form: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    showError: any;
    @Output() formSubmit = new EventEmitter<any>();

    constructor(
        public router: Router
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
