import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() gridOptions!: any;
  @Output() setDataSource : EventEmitter<any> = new EventEmitter();
  @Output() selectAllCheckbox!: EventEmitter<void>;
  @Input() selectedRowCount!: any;
  @Input() selectAllOption!: boolean;
  @Input() sizeNotFit!: any;

  constructor() { }

  ngOnInit(): void {
  }

  

 

}
