import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-cmp-input-datepicker',
    templateUrl: './cmp-input-datepicker.component.html',
    styleUrls: ['./cmp-input-datepicker.component.scss']
})
export class CmpInputDatepickerComponent implements OnInit {
    @Input() dateLabel: string;
    @Input() value?: Date | null;
    @Input() minDate?: Date | null = null;
    @Input() maxDate?: Date | null = null;
    @Input() placeholder: string = 'Select date';
    @Output() valueChange = new EventEmitter<Date | null>();
    calculatedPlaceholder: string;
    defaultPlaceholder: string;

    @ViewChild('dp') datepicker?: any;

    constructor() {
        this.defaultPlaceholder = 'mm/dd/yyyy';
        this.calculatedPlaceholder = this.defaultPlaceholder;
    }



    myDateValue: Date;

    ngOnInit() {
        this.myDateValue = new Date();
    }



    ngOnChanges() {
        this.updatePlaceholder();
    }
    ngAfterViewInit() { }

    /**
     * Function to open and close datepicker dropdown.
     * @param {MouseEvent} event
     * @author PSI-Enhancement
     * @returns void
     */
    toggleDropdown() {
        this.datepicker?.toggle();
    }


    onDateChange(date: Date | undefined) {
        this.value = date ?? null;
        this.updatePlaceholder();
        this.valueChange.emit(this.value);
    }

    updatePlaceholder() {
        this.calculatedPlaceholder = this.value
            ? this.formatDate(this.value)
            : this.placeholder;
    }

    formatDate(date: Date): string {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${d.getFullYear()}`;
    }

    clearDate() {
        this.value = null;
        this.updatePlaceholder();
        this.valueChange.emit(null);
    }

}
