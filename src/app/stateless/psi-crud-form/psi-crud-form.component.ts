import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-psi-crud-form',
  templateUrl: './psi-crud-form.component.html',
  styleUrls: ['./psi-crud-form.component.scss']
})
export class PsiCrudFormComponent implements OnInit {

  @Input() leftHeaderTitle: string;
  @Input() rightHeaderTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

}
