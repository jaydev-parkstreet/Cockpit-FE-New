import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { MainHeaderComponent } from '../main-header/main-header.component';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {
  isSidebarExpanded !:any;
  @ViewChild('mainHeader') mainHeader !: MainHeaderComponent;

  constructor() { }

  ngOnInit(): void {
    this.isSidebarExpanded = true;
  }

  menuToggle (value) {
    this.isSidebarExpanded = value;
  }

}
