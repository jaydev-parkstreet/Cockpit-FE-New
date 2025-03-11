import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-psi-page-column-header',
  templateUrl: './psi-page-column-header.component.html',
  styleUrls: ['./psi-page-column-header.component.scss']
})
export class PsiPageColumnHeaderComponent implements OnInit {
 
  @Input() headerTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

}
