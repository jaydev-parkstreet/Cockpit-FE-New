import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Setting } from 'src/app/interfaces/setting';

@Component({
    selector: 'app-cmp-input-datepicker',
    templateUrl: './cmp-input-datepicker.component.html',
    styleUrls: ['./cmp-input-datepicker.component.scss']
})
export class CmpInputDatepickerComponent implements OnInit {
    @Input() dateLabel: string;
    @Input() selectedDate: Date | null;
    @Input() setting: Setting;
    @Input() type: 'from' | 'to' | 'default';
    @Input() min: any;
    @Input() max: any;
    @Output() dateModelChange = new EventEmitter<{ type: 'from' | 'to' | 'default', value: Date | null }>();

    calculatedPlaceholder: string;
    
    @ViewChild('dp') datepicker?: any;

    constructor() {
    }

    ngOnInit() {
        this.updatePlaceholder();
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
        this.selectedDate = null;
        this.updatePlaceholder();
        this.dateModelChange.emit({ type: this.type, value: null });
    }

}
