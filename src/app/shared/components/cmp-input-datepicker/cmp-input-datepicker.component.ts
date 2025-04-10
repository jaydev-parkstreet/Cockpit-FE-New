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
    @Input() placeholder: string = 'mm/dd/yyyy';
    @Output() valueChange = new EventEmitter<{ type: 'from' | 'to' | 'default', value: Date | null }>();
    calculatedPlaceholder: any;
    defaultPlaceholder: string;
    dateRange:any = "02-04-2023"
    @Input() type: 'from' | 'to' | 'default';

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


    onDateChange(date: any | undefined) {
        this.value = date ?? null;
        this.updatePlaceholder();
        this.valueChange.emit({ type: this.type, value: this.value });
    }

    updatePlaceholder() {
        this.calculatedPlaceholder = this.value || this.placeholder;
    }

    clearDate() {
        this.value = null;
        this.updatePlaceholder();
        this.valueChange.emit({ type: this.type, value: null });
    }

}
