import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-psi-checkbox',
  templateUrl: './psi-checkbox.component.html',
  styleUrls: ['./psi-checkbox.component.scss']
})
export class PsiCheckboxComponent implements OnInit {

  @Input() field: any;
  @Input() checkedValue: any;
  @Input() validationClasses: any;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Handles the change event from the checkbox. Emits the value to the parent
   * component.
   *
   * @param {boolean} checked
   * @author psi-enhancement
   */
  onChangeValue(checked) {
    this.valueChanged.emit(checked);
  }
}
