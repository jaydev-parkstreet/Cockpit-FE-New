import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Setting } from 'src/app/interfaces/setting';
import * as moment from 'moment';

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
        if (!this.selectedDate) {
            this._date = null;
            return;
        }
        const parsed = moment(this.selectedDate, 'MM/DD/YYYY', true);
        this._date = parsed.isValid() ? parsed.toDate() : null;
    }
 

    get dateModel(): Date | null {
        return this._date;
    }

    /**
     * Setter for the internal _date property, emits the change.
     */
    set dateModel(newDate: Date | null) {
        if (this._date?.getTime() === newDate?.getTime()) return;
        this._date = newDate;
        this.dateModelChange.emit({ type: this.type, value: newDate });
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
        if (!date || isNaN(date.getTime())) {
            this.selectedDate = null;
            this.dateModel = null;
            this.dateModelChange.emit({ type: this.type, value: null });
            return;
        }

        const formattedDate = moment(date).format('MM/DD/YYYY');
        this.selectedDate = formattedDate;
        this.dateModel = moment(formattedDate, 'MM/DD/YYYY').toDate();
        this.dateModelChange.emit({ type: this.type, value: this.dateModel });
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
