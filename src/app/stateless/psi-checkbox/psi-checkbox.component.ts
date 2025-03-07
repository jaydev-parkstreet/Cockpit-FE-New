import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-psi-checkbox',
  templateUrl: './psi-checkbox.component.html',
  styleUrls: ['./psi-checkbox.component.scss']
})
export class PsiCheckboxComponent implements OnInit {

  @Input() field: any;
  @Input() form: any;
  @Input() validationClasses: any;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() { }

  ngOnInit(): void {
    console.log(this.form);
  }

  /**
   * Handles the change event from the checkbox. Emits the value to the parent
   * component.
   *
   * @param {boolean} checked
   * @author psi-enhancement
   */
  onChangeValue(checked) {
    console.log(checked);
    this.valueChanged.emit(checked);
  }
}
