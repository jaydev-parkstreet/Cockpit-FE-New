import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-psi-page-column-header',
  templateUrl: './psi-page-column-header.component.html',
  styleUrls: ['./psi-page-column-header.component.scss']
})
export class PsiPageColumnHeaderComponent implements OnInit {
 
  @Input() headerTitle: string;
  @Input() headerIconConfig: any;
  @Output() clearAllClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClearAllClick(): void {
    this.clearAllClicked.emit();
  }
}
