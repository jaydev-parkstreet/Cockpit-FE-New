import { Component, OnInit, Input, EventEmitter, Output, HostListener, SimpleChanges } from '@angular/core';
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
    fromDate: any;
    toDate: any;
    @Input() filter: any;
    @Input() required: boolean = false;
    @Input() selectedDateRange: any ;
    @Input() datesArray: DateRangeOption | null;
    @Output() dateRangeModelChange = new EventEmitter<any>();
    @Input() resetTrigger: boolean;

    min: Date;
    max: Date;

    constructor(private datePipe: DatePipe, private commonService: CommonService) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['resetTrigger'] && changes['resetTrigger'].currentValue === true) {
            this.clearDate();
        }
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
    onDateSelected(event: { type: string, value: Date | null }) {
        if (event.type === (this.filter?.key+"_from") || event.type === 'default') {
            this.fromDate = event.value;
        } else {
            this.toDate = event.value;
        }
        this.emitDateRangeValue();
        this.formatDateRange();
    }

    emitDateRangeValue() {
        const payloadFormat = 'yyyy-MM-dd';
        let dateObj = [
            {
                type: this.filter?.key + "_from",
                value: this.fromDate ? this.datePipe.transform(this.fromDate, payloadFormat) : null
            },
            {
                type: this.filter?.key + "_to",
                value: this.toDate ? this.datePipe.transform(this.toDate, payloadFormat) : null
            }
        ];
        this.dateRangeModelChange.emit(dateObj);
    }

    /**
     * Builds formatted date range string for display.
     *
     * @author PSI-Enhancement
     * @returns void
     */
    formatDateRange(): any {
        const placeholder = 'mm/dd/yyyy';
        const fromStr = this.fromDate ? this.datePipe.transform(this.fromDate, 'MM/dd/yyyy') : placeholder;
        const toStr = this.toDate ? this.datePipe.transform(this.toDate, 'MM/dd/yyyy') : placeholder;
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
            this.formatDateRange();
        } else {
            this.defaultDateValues = value;
            this.fromDate = this.commonService.convertToDateObject(this.defaultDateValues?.start);
            this.toDate = this.commonService.convertToDateObject(this.defaultDateValues?.end);
            this.min = this.commonService.convertToDateObject(this.defaultDateValues?.start);
            this.max = this.commonService.convertToDateObject(this.defaultDateValues?.end);
            this.emitDateRangeValue();
            this.formatDateRange();
        }
    }

    /**
    * Clears the selected date range and resets default values to empty state.
    */
    clearDate() {
        event.stopPropagation();
        this.fromDate = this.toDate = null;
        this.selectedDate = null;
        this.defaultDateValues = { id: 0, name: '', start: null, end: null, mobile_name: '' };
        this.emitDateRangeValue();
        this.formatDateRange();
    }
}
