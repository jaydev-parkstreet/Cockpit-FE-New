import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-psi-input-text-field',
  templateUrl: './psi-input-text-field.component.html',
  styleUrls: ['./psi-input-text-field.component.scss']
})
export class PsiInputTextFieldComponent implements OnInit {
  @Input() field: any;
  @Input() validationClasses: any;
  @Input() form: any;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onValueChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChanged.emit(value);
  }
}
