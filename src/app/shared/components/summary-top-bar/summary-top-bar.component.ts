import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary-top-bar',
  templateUrl: './summary-top-bar.component.html',
  styleUrls: ['./summary-top-bar.component.scss']
})
export class SummaryTopBarComponent implements OnInit {
  @Input() config: any;
  @Input() filterList: any;
  @Output() addProduct = new EventEmitter<any>();
  @Output() applyFilters = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<any>();
  topBarConfig : any;
  tooltipText:any;
  isExpandFilter = false; 
  dropdown1Label = 'Product Status';
  selectedFilters = {}

  constructor(private router:Router) { }

  ngOnInit(): void {
    this.tooltipText = 'hello';
  }

  toggleFilter() {
    this.isExpandFilter = !this.isExpandFilter;
  }

  onFilterChange(key: string, value: any) {
    // Update the selected filter values when any filter changes
    this.selectedFilters[key] = value;
  }

  applyFilterChanges() {
    this.applyFilters.emit(this.selectedFilters);
  }

  resetFilterChanges() {
    this.selectedFilters = {};
    this.resetFilters.emit();
  }

}
