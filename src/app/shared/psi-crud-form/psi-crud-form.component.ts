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
    showError: any;
    @Output() formSubmit = new EventEmitter<any>();
    @Output() clearAllClicked: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public router: Router,
            private simpleModalService: SimpleModalService,
    ) { }

    ngOnInit(): void {
        this.showError = false
        this.formSubmitted = false
    }

    clearAllSelections(): void {
        this.clearAllClicked.emit();
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
}
