import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-psi-action-buttons',
  templateUrl: './psi-action-buttons.component.html',
  styleUrls: ['./psi-action-buttons.component.scss']
})
export class PsiActionButtonsComponent implements OnInit {
  @Input() actionButtons: { name: string; class: string; button: string; disabled: boolean }[] = [];
  @Output() actionClicked = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
  }

  actionEvent(actionName: string) {
    this.actionClicked.emit(actionName);
  }
}
