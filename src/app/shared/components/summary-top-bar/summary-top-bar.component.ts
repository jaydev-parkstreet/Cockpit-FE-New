import { Component, OnInit, Input, Output, EventEmitter, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CmpInputDropdownComponent } from '../cmp-input-dropdown/cmp-input-dropdown.component';
import { CmpCheckboxComponent } from '../cmp-checkbox/cmp-checkbox.component';

@Component({
  selector: 'app-summary-top-bar',
  templateUrl: './summary-top-bar.component.html',
  styleUrls: ['./summary-top-bar.component.scss']
})

export class SummaryTopBarComponent implements OnInit {
  @Input() config: any;
  @Input() productChecked: any;
  @Input() filterList: any;
  @Output() addProduct = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<any>();
  @Output() onEnter = new EventEmitter<any>();
  @Output() onClickAction: EventEmitter<{ action: any }> = new EventEmitter<{ action: any }>();
  @Output() excelExport = new EventEmitter<any>();
  @Output() OnChangeDateModel = new EventEmitter<any>();
  topBarConfig: any;
  tooltipText: any;
  selectedFilters: { [key: string]: any } = {}
  isAllItemsSelected: boolean = false;
  isIndeterminate: boolean = false;
  @ViewChildren(CmpInputDropdownComponent) dropdowns: QueryList<CmpInputDropdownComponent>;
  @ViewChildren(CmpCheckboxComponent) checkBoxes: QueryList<CmpCheckboxComponent>;
  checkedItems: any = {};
  datesArray: any = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.tooltipText = 'Export To Excel';
    this.datesArray= [
      {
          "id": 15,
          "name": "Last 30 Days",
          "start": "2025-03-11",
          "end": "2025-04-11",
          "mobile_name": "L30"
      },
      {
          "id": 5,
          "name": "This Month-to-Date",
          "start": "2025-04-01",
          "end": "2025-04-11",
          "mobile_name": "MTD"
      },
      {
          "id": 7,
          "name": "This Quarter-to-Date",
          "start": "2025-04-01",
          "end": "2025-04-11",
          "mobile_name": "QTD"
      },
      {
          "id": 9,
          "name": "This Year-to-Date",
          "start": "2025-01-01",
          "end": "2025-04-11",
          "mobile_name": "YTD"
      }
    ]
  }


  onFilterChange(key: string, value: any) {
    this.selectedFilters[key] = value;
    this.isAllItemsSelected = value.length === this.filterList[key]?.length; 
    this.isIndeterminate = value.length > 0 && value.length < this.filterList[key]?.length; 
  }
  onCheckedInput(key: any, value: any) {
    this.selectedFilters[key] = value === true ? 1 : 0;
  }

  applyFilterChanges() {
    this.applyFilters.emit(this.selectedFilters);
  }

  resetFilterChanges() {  
    this.selectedFilters = {};
    this.isAllItemsSelected = false;
    this.isIndeterminate = false;
    if (this.config.allowSingleSelect) {
      this.selectedFilters = {}; 
    }
    this.resetFilters.emit();
    setTimeout(() => {
      this.selectedFilters = {};  
      this.isAllItemsSelected = false; 
      this.isIndeterminate = false; 
      this.resetDropdownsState();
 
    }, 0);
 
  }
  resetDropdownsState() {
    this.dropdowns.forEach((dropdown) => {
      dropdown.resetDropdownState();
    });
  }
  
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
   * @author [Your Name]
   */
    handleDropdownCloseWithServerFiltering(key, selectedFilters) {
        this.filterList[key] = selectedFilters;
    }
}
