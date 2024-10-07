import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-psi-action-buttons',
  templateUrl: './psi-action-buttons.component.html',
  styleUrls: ['./psi-action-buttons.component.scss']
})
export class PsiActionButtonsComponent implements OnInit {
  @Input() actionButtons: { name: string; class: string; button: string; disabled: boolean }[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
