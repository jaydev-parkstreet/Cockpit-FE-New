import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-psi-input-text-field',
  templateUrl: './psi-input-text-field.component.html',
  styleUrls: ['./psi-input-text-field.component.scss']
})
export class PsiInputTextFieldComponent implements OnInit {
  @Input() field: any;
  @Input() validationClasses: any;
  @Input() valueEntered: any;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Handles input change events, emitting the new value to the valueChanged output.
   * @param event
   * @author psi-enhancement
   */
  onValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(value);
  }

  onInputValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputValueChange.emit(value);
  }
}
