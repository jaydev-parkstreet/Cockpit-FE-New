import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, OnInit, Renderer2} from '@angular/core';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnChanges, OnInit {

  @Input() gridOptions: any;
  @Input() selectAllOption: boolean;
  @Input() checkAll: boolean;
  @Output() selectAllChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('checkboxSelectAll') checkboxSelectAll!: ElementRef;
  @ViewChild('checkboxContainer') checkboxContainer!: ElementRef;

  constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
      if(this.selectAllOption) {
        this.gridOptions.onBodyScroll = this.onGridBodyScroll.bind(this);      
      }
    }

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

    onGridBodyScroll(event: any) { 
      if (event.direction === 'horizontal' && event.left >= 20) {
        this.renderer.setStyle(this.checkboxContainer.nativeElement, 'display', 'none');
      } else if (event.direction === 'horizontal') {
        this.renderer.setStyle(this.checkboxContainer.nativeElement, 'display', 'block');
      }
    }
}
