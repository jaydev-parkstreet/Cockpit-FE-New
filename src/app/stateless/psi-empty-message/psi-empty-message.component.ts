import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-psi-empty-message',
  templateUrl: './psi-empty-message.component.html',
  styleUrls: ['./psi-empty-message.component.scss']
})
export class PsiEmptyMessageComponent implements OnInit {

  @Input() message: string = '';
  @Input() icon: string = '';
  @Input() showIcon: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
