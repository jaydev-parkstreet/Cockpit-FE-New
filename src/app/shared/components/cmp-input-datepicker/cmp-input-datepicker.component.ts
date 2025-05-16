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
        if (changes['selectedDate']) {
            this._parseInputDate();
        }
    }

    private _parseInputDate(): void {
        if (this.selectedDate && typeof this.selectedDate === 'string') {
            const parts = this.selectedDate.split('/');
            if (parts.length === 3) {
                const month = parseInt(parts[0], 10) - 1;
                const day = parseInt(parts[1], 10);
                const year = parseInt(parts[2], 10);
                const parsedDate = new Date(Date.UTC(year, month, day));
    
                if (!isNaN(parsedDate.getTime())) {
                    this._date = parsedDate;
                } else {
                    this._date = null;
                }
            } else {
                this._date = null;
            }
        } else if (this.selectedDate instanceof Date || this.selectedDate === null) {
            this._date = this.selectedDate instanceof Date ? new Date(Date.UTC(
                this.selectedDate.getFullYear(),
                this.selectedDate.getMonth(),
                this.selectedDate.getDate()
            )) : null;
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
        if (date) {
            const normalizedDate = new Date(Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ));
            this.selectedDate = normalizedDate;
            this.dateModel = normalizedDate;
            this.dateModelChange.emit({ type: this.type, value: normalizedDate });
        } else {
            this.selectedDate = null;
            this.dateModel = null;
            this.dateModelChange.emit({ type: this.type, value: null });
        }
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
