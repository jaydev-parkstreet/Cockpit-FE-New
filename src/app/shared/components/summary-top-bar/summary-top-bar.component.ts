import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CmpInputDropdownComponent } from '../cmp-input-dropdown/cmp-input-dropdown.component';

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
  topBarConfig: any;
  tooltipText: any;
  isExpandFilter = false;
  dropdown1Label = 'Product Status';
  selectedFilters: { [key: string]: any[] } = {}
  isAllItemsSelected: boolean = false;
  isIndeterminate: boolean = false;
  @ViewChildren(CmpInputDropdownComponent) dropdowns: QueryList<CmpInputDropdownComponent>;
  
  constructor(private router: Router,private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  toggleFilter() {
    this.isExpandFilter = !this.isExpandFilter;
  }

  onFilterChange(key: string, value: any) {
    this.selectedFilters[key] = value;
    this.isAllItemsSelected = value.length === this.filterList[key]?.length; 
    this.isIndeterminate = value.length > 0 && value.length < this.filterList[key]?.length; 
    this.applyFilterChanges(); 
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
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.selectedFilters = {};  
      this.isAllItemsSelected = false; 
      this.isIndeterminate = false; 
      this.cdRef.detectChanges();    
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

}
