import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ps-default-link',
  templateUrl: './ps-default-link.component.html',
  styleUrls: ['./ps-default-link.component.scss']
})
export class PsDefaultLinkComponent implements OnInit {
  @Input() fontIcon: string;
  @Input() linkTitle: string;
  constructor() { }

  ngOnInit(): void {
  }

  functionLink() {
  }

}
