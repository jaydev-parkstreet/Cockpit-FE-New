import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuData = [];

  constructor() { }

  ngOnInit(): void {
    this.menuData = [{
      iconClass: 'fas fa-tachometer-alt',
      menuContent: 'Dashboard'
    },
    {
      iconClass: 'fas fa fa-home',
      menuContent: 'Gateway'
    }, {
      iconClass: 'fas fa-sitemap',
      menuContent: 'Companies & Contacts'
    },
    {
      iconClass: 'fas fa-glass-martini',
      menuContent: 'Suppliers'
    },
    {
      iconClass: 'fas fa-dollar-sign',
      menuContent: 'Accounting'
    },
    {
      iconClass: 'fas fa-cogs',
      menuContent: 'Operations'
    },
    {
      iconClass: 'fas fa-stamp',
      menuContent: 'Compliance'
    },{
      iconClass: 'fas fa-certificate',
      menuContent: 'Shared Services'
    },{
      iconClass: 'fas fa-poll',
      menuContent: 'Supplier Development'
    },{
      iconClass: 'fas fa-trophy',
      menuContent: 'Service Standards'
    },{
      iconClass: 'fas fa-bullhorn',
      menuContent: 'Announcements'
    },{
      iconClass: 'fas fa-code',
      menuContent: 'Product Development'
    },{
      
      menuContent: 'Beta Tools'

    }];
  }

}
