import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateRangeOption } from 'src/app/interfaces/date-range';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
    selector: 'app-cmp-date-range',
    templateUrl: './cmp-date-range.component.html',
    styleUrls: ['./cmp-date-range.component.scss'],
    providers: [DatePipe]
})
export class CmpDateRangeComponent implements OnInit {

    isOpen: boolean = false;
    defaultDateValues: DateRangeOption | null;
    selectedDate: string;
    fromDate: string;
    toDate: string;
    @Input() label: string;
    @Input() required: boolean = false;
    @Input() datesArray: DateRangeOption | null;
    min: Date;
    max: Date;

    constructor(private datePipe: DatePipe, private commonService: CommonService) { }

    ngOnInit(): void {
    }

    ngOnChanges() {
        this.setDateValues('');
    }

    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }

    /**
    * Handles the click event outside the dropdown to close it.
    * @param {MouseEvent} event
    * @author PSI-Enhancement
    * @returns void
    */
    @HostListener('document:click', ['$event'])
    handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (this.isOpen && !target.closest('.input-dropdown')) {
            this.isOpen = false;
        }
    }

    /**
    * Checks if the dropdown is currently open.
    * @param none
    * @returns {boolean}
    * @author PSI-Enhancement
    */
    isDropdownOpen(): boolean {
        return this.isOpen;
    }

    /**
     * Updates from/to date based on selection and refreshes the display string
     *
     * @param event - The emitted object containing the type of date ('from', 'to', or 'default') and the selected Date value.
     * @author PSI-Enhancement
     * @returns void
     */
    onDateSelected(event: { type: 'from' | 'to' | 'default', value: Date | null }) {
        if (event.type === 'from' || event.type === 'default') {
            this.fromDate = this.datePipe.transform(event.value, 'MM/dd/yyyy');
        } else {
            this.toDate = this.datePipe.transform(event.value, 'MM/dd/yyyy');
        }

        this.formatDateRange();
    }

    /**
     * Builds formatted date range string for display.
     *
     * @author PSI-Enhancement
     * @returns void
     */
    formatDateRange(): any {
        const placeholder = 'mm/dd/yyyy';

        const fromStr = this.fromDate || placeholder;
        const toStr = this.toDate || placeholder;
        this.selectedDate = `${fromStr} - ${toStr}`;
    }

    /**
     * Sets initial or provided date values and updates display.
     *
     * @param {any} value - Optional date range value to initialize; if not provided, defaults are used.
     * @author PSI-Enhancement
     * @returns void
     */
    setDateValues(value: any) {
        if (!value) {
            this.defaultDateValues = this.datesArray ? this.datesArray[0] : null;
        } else {
            this.defaultDateValues = value;
        }
        this.fromDate = this.datePipe.transform(this.defaultDateValues?.start, 'MM/dd/yyyy');
        this.toDate = this.datePipe.transform(this.defaultDateValues?.end, 'MM/dd/yyyy');
        this.min = this.commonService.convertToDateObject(this.defaultDateValues?.start);
        this.max = this.commonService.convertToDateObject(this.defaultDateValues?.end);
        this.formatDateRange();
    }

    /**
    * Clears the selected date range and resets default values to empty state.
    */
    clearDate() {
        event.stopPropagation();
        this.fromDate = this.toDate = this.selectedDate = null;
        this.defaultDateValues = { id: 0, name: '', start: null, end: null, mobile_name: '' };
        this.formatDateRange();
    }
}
