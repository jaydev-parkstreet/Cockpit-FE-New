import { Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { AfterViewInit,EventEmitter } from '@angular/core';
// import { Grid } from 'ag-grid/dist/lib/grid';

@Component({
  selector: 'app-psi-ag-grid',
  templateUrl: './psi-ag-grid.component.html',
  styleUrls: ['./psi-ag-grid.component.scss']
})
export class PsiAgGridComponent implements OnInit, AfterViewInit {
  @Input() divId !: String;
  @Input() gridHeight!: any;
  @Input() gridOptions!: any;
  @Output() setDataSource: EventEmitter<any>= new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.initAgGridTable();
  }

  /**
   * Function to Initialize ag grid
   * @createdDate 01-10-2024
   * @author PSI-Enhancements
   */
  initAgGridTable() {
    const gridDiv = this.elementRef.nativeElement.querySelector('#' + this.divId);
    // new Grid(gridDiv, this.gridOptions);
    this.setGridHeight(gridDiv);
    // const testData = [
    //   { id: 1, name: 'Test 1' },
    //   { id: 2, name: 'Test 2' }
    // ];
    
    // this.gridOptions.api.setRowData(testData);
    // this.setDataSource();
    this.setDataSource.emit();
  }

  /**
   * Function to set grid height according to filter container
   * @createdDate 01-10-2024
   * @author PSI-Enhancements
   */
  setGridHeight(gridDiv) {
    const height = this.gridHeight || 500;
    gridDiv.style.height = `${height}px`;
    this.gridOptions.api?.doLayout();
  }

}
