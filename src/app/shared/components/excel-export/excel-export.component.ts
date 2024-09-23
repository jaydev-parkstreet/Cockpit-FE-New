import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss']
})
export class ExcelExportComponent implements OnInit {
  @Input() tooltipText!:any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.tooltipText);
     
  }

}
