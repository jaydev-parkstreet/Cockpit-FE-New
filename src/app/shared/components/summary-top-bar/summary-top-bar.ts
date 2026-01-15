import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppConstant } from '../../../core/constant/app.constant';
import { CommonModule } from '@angular/common';
import { Button } from '../button/button';

interface Action {
  type: string
  iconClass: string;
  divClass: string;
  tooltipText: string;
  disabled: boolean;
  btnType: 'primary' | 'secondary' | 'ghost';
  btnClass: string;
  buttonIconLeft: string;
  buttonIconRight: string;
  btnText: string;
}

interface Filters {
  type: string;
  divClass: string;
}

interface Config {
  mainClass?: string;
  allowSingleSelect?: boolean;
  hideSearch?: boolean;
  isResultLoading?: boolean;
  totalResult?: number;
  expandFilter?: boolean;
  filtersConfig?: Filters[];
  actions?: Action[]
}

@Component({
  selector: 'app-summary-top-bar',
  imports: [CommonModule, Button],
  templateUrl: './summary-top-bar.html',
  styleUrl: './summary-top-bar.scss',
})
export class SummaryTopBar {
  @Input() config: Config = {};
  @Input() productChecked: any;
  @Input() filterList: any;
  @Input() datesArray: any;
  @Output() addProduct = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<any>();
  @Output() onEnter = new EventEmitter<any>();
  @Output() onClickAction: EventEmitter<{ action: Action }> = new EventEmitter<{ action: Action }>();
  @Output() excelExport = new EventEmitter<any>();
  @Output() OnChangeDateModel = new EventEmitter<any>();
  topBarConfig: any;
  selectedFilters: { [key: string]: any } = {
    supplier: [],
    supplier_status: [],
    credit_card_on_file: []
  }
  isAllItemsSelected: boolean = false;
  isIndeterminate: boolean = false;
  checkedItems: any = {};
  dateResetFlag: boolean = false;
  rangeFilter: any = {}

  /**
   * function to filter change
   * @param key - filter key
   * @param value - filter value
   * @author PSI-Enhancement
   */
  onFilterChange(key: string, value: any) {
    this.selectedFilters[key] = value;
    this.isAllItemsSelected = value?.length === this.filterList[key]?.length;
    this.isIndeterminate = value?.length > 0 && value?.length < this.filterList[key]?.length;
  }

    /**
     * Function to append selected date range to selected filters
     * 
     * @author PSI-II
     * @createdDate 03-09-2025
     * @param object range
     * @param string key
     * @returns void
     */
    onChangeDateRange(range: any, key: string) {
        this.rangeFilter = {...this.rangeFilter, ...range};
        // this.selectedFilters[key + '_from'] = this.datePipe.transform(range[key + '_from'], AppConstant.DATE_FORMAT.DB_DATE) ;
        // this.selectedFilters[key + '_to'] = this.datePipe.transform(range[key + '_to'], AppConstant.DATE_FORMAT.DB_DATE) ;
    }

    /**
     * function to set the selected filters
     * @param key - filter key
     * @param value - filter value
     * @author PSI-Enhancement
     */
    onCheckedInput(key: any, value: any) {
        this.selectedFilters[key] = value === true ? 1 : 0;
    }

    /**
     * function to apply filter changes
     * @author PSI-Enhancement
     */
    applyFilterChanges() {
        this.applyFilters.emit(this.selectedFilters);
    }

    /**
     * function to reset filter changes
     * @author PSI-Enhancement
     */
    resetFilterChanges() {
        this.rangeFilter = {};
        this.selectedFilters = {
            supplier: [],
            supplier_status: [],
            credit_card_on_file: []
        };
        this.isAllItemsSelected = false;
        this.isIndeterminate = false;
        this.dateResetFlag = true;
        if (this.config.allowSingleSelect) {
            this.selectedFilters = {};
        }
        this.resetFilters.emit();
        setTimeout(() => {
            this.selectedFilters = {};
            this.isAllItemsSelected = false;
            this.isIndeterminate = false;
        }, 0);
    }

    /**
     * function to handle select all state
     * @author PSI-Enhancement
     */
    updateSelectAllState(): void {
        const allSelected = Object.values(this.selectedFilters).every(val => val.length === this.filterList[val[0]?.id]?.length);
        this.isAllItemsSelected = allSelected;
        this.isIndeterminate = !allSelected && Object.values(this.selectedFilters).some(val => val.length > 0);
    }

    /**
     * Handles the event when the dropdown is closed while using server-side filtering.
     * 
     * @param {string} key
     * @param {any} selectedFilters
     * @author PSI-Enhancement
     */
    handleDropdownCloseWithServerFiltering(key: string, selectedFilters: any) {
        this.filterList[key] = selectedFilters;
    }

    onClickFilter() {
        this.config.expandFilter = !this.config.expandFilter;
    }

}
