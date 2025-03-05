import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-psi-input-text-field',
  templateUrl: './psi-input-text-field.component.html',
  styleUrls: ['./psi-input-text-field.component.scss']
})
export class PsiInputTextFieldComponent implements OnInit {
  @Input() field: any;

  constructor() { }

  ngOnInit(): void {
  }

}
