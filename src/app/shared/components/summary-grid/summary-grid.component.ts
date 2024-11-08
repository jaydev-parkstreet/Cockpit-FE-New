import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnChanges {

  @Input() gridOptions: any;
  @Input() selectAllOption: boolean;
  @Input() checkAll: boolean;
  @Output() selectAllChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkboxSelectAll') checkboxSelectAll!: ElementRef;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['checkAll']) {
      this.setCheckboxState(this.checkAll);
    }
  }

  onSelectAllChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectAllChanged.emit(isChecked);
  }

  setCheckboxState(isChecked: boolean): void {
    if (this.checkboxSelectAll) {
        this.checkboxSelectAll.nativeElement.checked = isChecked;
    }
}
}
