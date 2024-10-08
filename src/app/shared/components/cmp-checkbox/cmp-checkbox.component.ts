import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cmp-checkbox',
  templateUrl: './cmp-checkbox.component.html',
  styleUrls: ['./cmp-checkbox.component.scss']
})
export class CmpCheckboxComponent implements OnInit {
  @Input() inputLabel: string;
  @Input() inputKey: string;
  @Input() isDisabled: boolean;
  @Input() model: any;
  @Output() onChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }


  changeValue(val): any {
    this.onChange.emit(val);
  }

}

