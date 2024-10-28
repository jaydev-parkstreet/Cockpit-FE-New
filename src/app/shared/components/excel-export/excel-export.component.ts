import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss']
})
export class ExcelExportComponent implements OnInit {
  @Input() tooltipText!:any;
  @Output() onExcelSheet: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.tooltipText);
     
  }
}
