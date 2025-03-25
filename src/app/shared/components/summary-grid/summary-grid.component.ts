import { 
  Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, Renderer2, HostListener
} from '@angular/core';

@Component({
  selector: 'app-summary-grid',
  templateUrl: './summary-grid.component.html',
  styleUrls: ['./summary-grid.component.scss']
})
export class SummaryGridComponent implements OnInit {

    @Input() gridOptions: any;
    @Input() selectAllOption: boolean;
    @Input() sizeNotFit: boolean = false;
    @Input() selectedRowCount: number = 0; 
    
    @Output() selectAllCheckbox: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() setDataSource: EventEmitter<any> = new EventEmitter();
    
    @ViewChild('checkboxSelectAll') checkboxSelectAll!: ElementRef;
    @ViewChild('checkboxContainer') checkboxContainer!: ElementRef;

    gridHeight: number = 500;

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
        this.updateGridHeight();
        if (this.selectAllOption) {
            this.gridOptions.onBodyScroll = this.onGridBodyScroll.bind(this);
        }
    }

    /**
     * Handles window resize event to update grid height.
     * @author PSI-Enhancement
     */
    @HostListener('window:resize', ['$event'])
    onResize(): void {
        this.updateGridHeight();
    }

    /**
     * Updates the grid height based on window size.
     * @author PSI-Enhancement
     */
    updateGridHeight(): void {
        this.gridHeight = window.innerHeight - 200;
    }

    /**
     * Emits an event when the 'Select All' checkbox state changes.
     * 
     * @param event
     * @author PSI-Enhancement
     */
    onSelectAllChange(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.selectAllCheckbox.emit(isChecked);
    }

    /**
     * Initializes the grid and sets the data source.
     * 
     * @param params
     * @author PSI-Enhancement
     */
    onGridReady(params: any): void {
        this.gridOptions.api = params.api;
        this.gridOptions.columnApi = params.columnApi;
        this.setDataSource.emit(); 
        
        if (!this.sizeNotFit && window.innerWidth > 1280) {
            this.gridOptions.api.sizeColumnsToFit();
        }
    }

    /**
     * Sets the checkbox state for 'Select All'.
     * 
     * @param isChecked
     * @author PSI-Enhancement
     */
    setCheckboxState(isChecked: boolean): void {
        if (this.checkboxSelectAll) {
            this.checkboxSelectAll.nativeElement.checked = isChecked;
        }
    }

    /**
     * Handles grid body scroll event to toggle visibility of the checkbox container.
     * 
     * @param event - The scroll event object
     * @author PSI-Enhancement
     */
    onGridBodyScroll(event: any): void { 
        if (event.direction === 'horizontal') {
            const displayStyle = event.left >= 20 ? 'none' : 'block';
            this.renderer.setStyle(this.checkboxContainer.nativeElement, 'display', displayStyle);
        }
    }
}