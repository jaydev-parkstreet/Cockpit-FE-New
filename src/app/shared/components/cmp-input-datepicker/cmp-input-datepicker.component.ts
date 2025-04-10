import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Setting } from 'src/app/interfaces/setting';

@Component({
    selector: 'app-cmp-input-datepicker',
    templateUrl: './cmp-input-datepicker.component.html',
    styleUrls: ['./cmp-input-datepicker.component.scss']
})
export class CmpInputDatepickerComponent implements OnInit {
    @Input() dateLabel: string;
    @Input() selectedDate: Date;
    @Input() setting: Setting;
    @Output() dateModelChange = new EventEmitter<Date | null>();
    @ViewChild('dp') datepicker?: any;

    constructor() {
    }

    ngOnInit() {

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
       this.selectedDate = date;
       this.dateModelChange.emit(this.selectedDate);
    }

    /**
     * Function to clear selected date.
     * @param {MouseEvent} event
     * @author PSI-Enhancement
     * @returns void
     */
    clearDate() {
        this.selectedDate = null;
        this.dateModelChange.emit(this.selectedDate);
    }

}
