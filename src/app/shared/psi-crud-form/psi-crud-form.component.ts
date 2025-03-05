import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-psi-crud-form',
  templateUrl: './psi-crud-form.component.html',
  styleUrls: ['./psi-crud-form.component.scss']
})
export class PsiCrudFormComponent implements OnInit, OnChanges {

  @Input() leftHeaderTitle: string;
  @Input() rightHeaderTitle: string;
  @Input() rightHeaderBottomTitle: string;
  @Input() crudFieldConfig: any;
  @Input() sellectedData: any;
  @Input() form: any;
  @Output() onDropDownChange = new EventEmitter<any>();
  showError: any;
  formSubmitted: any;
  
  constructor() { }

  ngOnInit(): void {
    this.showError = false
    this.formSubmitted = false
    console.log(this.form);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }
  onDropdownStateChange(field , event) {
    this.onDropDownChange.emit({ field, event });
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return control?.invalid && (this.showError || this.formSubmitted);
  }
}
