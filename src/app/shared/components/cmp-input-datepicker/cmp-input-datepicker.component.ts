import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Setting } from 'src/app/interfaces/setting';

@Component({
    selector: 'app-cmp-input-datepicker',
    templateUrl: './cmp-input-datepicker.component.html',
    styleUrls: ['./cmp-input-datepicker.component.scss']
})
export class CmpInputDatepickerComponent implements OnInit {
    
    @Input() fieldConfig: any;
    @Input() selectedDate: Date | string | null;
    @Input() setting: Setting;
    @Input() type: string;
    @Input() min: any;
    @Input() max: any;
    @Input() validationClasses: any;
    @Output() dateModelChange = new EventEmitter<{ type: string, value: Date | null }>();

    calculatedPlaceholder: string;
    private _date: Date | null = null;

    @ViewChild('dp') datepicker?: any;

    constructor() {
    }

    ngOnInit() {
        this.updatePlaceholder();
        this._parseInputDate();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges triggered:', changes);
        if (changes['selectedDate']) {
            this._parseInputDate();
        }
    }

    private _parseInputDate(): void {
        console.log('selectedDate in _parseInputDate:', this.selectedDate, typeof this.selectedDate);
        if (this.selectedDate && typeof this.selectedDate === 'string') {
            const parts = this.selectedDate.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
                const day = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                const parsedDate = new Date(year, month, day);
    
                if (!isNaN(parsedDate.getTime())) {
                    this._date = parsedDate;
                    console.log('Parsed Date (Manual):', this._date);
                } else {
                    this._date = null;
                    console.warn(`Invalid date string provided: ${this.selectedDate}`);
                }
            } else {
                this._date = null;
                console.warn(`Unexpected date string format: ${this.selectedDate}`);
            }
        } else if (this.selectedDate instanceof Date || this.selectedDate === null) {
            this._date = this.selectedDate instanceof Date ? this.selectedDate : null;
        } else {
            this._date = null;
        }
    }
 

    get dateModel(): Date | null {
        return this._date;
    }

    /**
     * Setter for the internal _date property, emits the change.
     */
    set dateModel(newDate: Date | null) {
        this._date = newDate;
        console.log('dateModel Setter:', this._date); // <--- ADD THIS LINE
        this.dateModelChange.emit({ type: this.type, value: this._date });
    }

    /**
     * Function to open and close datepicker dropdown.
     * @author PSI-Enhancement
     * @returns void
     */
    toggleDropdown() {
        this.datepicker?.toggle();
    }

    /**
     * Function when date value changes.
     * @param {MouseEvent} event
     * @author PSI-Enhancement
     * @returns void
     */
    onDateChange(date: Date) {
        this.selectedDate = date ?? null;
        this.dateModel = date ?? null;
        console.log('bsValueChange Event:', date); // <--- ADD THIS LINE
        this.dateModelChange.emit({ type: this.type, value: this.selectedDate });
     }

    updatePlaceholder() {
        this.calculatedPlaceholder = this.setting?.placeholder || 'mm/dd/yyyy';
    }

    /**
     * Function to clear selected date.
     * @param {MouseEvent} event
     * @author PSI-Enhancement
     * @returns void
     */
    clearDate() {
        this.dateModel = null;
        this.selectedDate = null;
        this.updatePlaceholder();
        this.dateModelChange.emit({ type: this.type, value: null });
    }
}
