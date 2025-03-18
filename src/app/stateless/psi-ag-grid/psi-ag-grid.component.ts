import { Component, ElementRef, Input, OnInit, Output } from '@angular/core';
import { AfterViewInit,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-psi-ag-grid',
  templateUrl: './psi-ag-grid.component.html',
  styleUrls: ['./psi-ag-grid.component.scss']
})
export class PsiAgGridComponent implements  AfterViewInit {
  @Input() gridOptions!: any;
  @Output() setDataSource: EventEmitter<any>= new EventEmitter();

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.setDataSource.emit();
  }
}
