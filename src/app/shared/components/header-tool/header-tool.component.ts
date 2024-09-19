import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-tool',
  templateUrl: './header-tool.component.html',
  styleUrls: ['./header-tool.component.scss']
})
export class HeaderToolComponent implements OnInit {

  @Input() titleText: string;
  @Input() titleIcon: string;

  constructor() { }

  ngOnInit(): void { }

}
