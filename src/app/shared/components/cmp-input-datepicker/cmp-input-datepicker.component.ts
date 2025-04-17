import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Setting } from 'src/app/interfaces/setting';

@Component({
    selector: 'app-cmp-input-datepicker',
    templateUrl: './cmp-input-datepicker.component.html',
    styleUrls: ['./cmp-input-datepicker.component.scss']
})
export class CmpInputDatepickerComponent implements OnInit {
    
    @Input() fieldConfig: any;
    @Input() selectedDate: Date | null;
    @Input() setting: Setting;
    @Input() type: string;
    @Input() min: any;
    @Input() max: any;
    @Input() validationClasses: any;
    @Output() dateModelChange = new EventEmitter<{ type: string, value: Date | null }>();

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
