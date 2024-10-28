import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Input() config!:any;
  @Output() onEnter = new EventEmitter<any>();
  @Output() onClear = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
