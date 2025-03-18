import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, Renderer2, HostListener} from '@angular/core';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnInit {
  gridHeight: number = 500;
  @Input() gridOptions: any;
  @Input() selectAllOption: boolean;
  @Input() sizeNotFit: boolean = false;
  @Input() selectedRowCount: number = 0; 
  @Output() selectAllCheckbox: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkboxSelectAll') checkboxSelectAll!: ElementRef;
  @ViewChild('checkboxContainer') checkboxContainer!: ElementRef;
  @Output() setDataSource: EventEmitter<any>= new EventEmitter();

  constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
      this.updateGridHeight();
    }

    @HostListener('window:resize', ['$event'])
    onResize(): void {
      this.updateGridHeight();
    }
  
    updateGridHeight(): void {
      this.gridHeight = window.innerHeight - 200;
    }

  onSelectAllChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectAllCheckbox.emit(isChecked);
  }
  onGridReady(params: any): void {
    this.gridOptions.api = params.api;
    this.gridOptions.columnApi = params.columnApi;
    this.setDataSource.emit(); 
    if (!this.sizeNotFit && window.innerWidth > 1280) {
      this.gridOptions.api.sizeColumnsToFit();
    }
  }

  setCheckboxState(isChecked: boolean): void {
    if (this.checkboxSelectAll) {
        this.checkboxSelectAll.nativeElement.checked = isChecked;
    }
}

    onGridBodyScroll(event: any) { 
      if (event.direction === 'horizontal' && event.left >= 20) {
        this.renderer.setStyle(this.checkboxContainer.nativeElement, 'display', 'none');
      } else if (event.direction === 'horizontal') {
        this.renderer.setStyle(this.checkboxContainer.nativeElement, 'display', 'block');
      }
    }
}
