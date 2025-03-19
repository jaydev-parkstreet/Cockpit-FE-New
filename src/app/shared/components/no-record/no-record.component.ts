import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-record',
  templateUrl: './no-record.component.html',
  styleUrls: ['./no-record.component.scss']
})
export class NoRecordComponent implements OnInit {

  @Input() iconClass:string;
  @Input() placeHolderText:string;

  constructor() { }

  ngOnInit(): void {
  }

}
