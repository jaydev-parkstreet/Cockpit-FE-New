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
      id:1,
      iconClass: 'fas fa-tachometer-alt',
      menuContent: 'Dashboard',
      isExpanded: false
    },
    { id:2,
      iconClass: 'fas fa fa-home',
      menuContent: 'Gateway',
      isExpanded: false
    }, {
      id:3,
      iconClass: 'fas fa-sitemap',
      menuContent: 'Companies & Contacts',
      isExpanded: false
    },
    { id:4,
      iconClass: 'fas fa-glass-martini',
      menuContent: 'Suppliers',
      isExpanded: false
    },
    { id:5,
      iconClass: 'fas fa-dollar-sign',
      menuContent: 'Accounting',
      isExpanded: false
    },
    { id:6,
      iconClass: 'fas fa-cogs',
      menuContent: 'Operations',
      isExpanded: false,
      submenuItems :[{
        submenuContent:'Product Management System'
      }]
    },
    { id:7,
      iconClass: 'fas fa-stamp',
      menuContent: 'Compliance',
      isExpanded: false
    },{ id:8,
      iconClass: 'fas fa-certificate',
      menuContent: 'Shared Services',
      isExpanded: false
    },{ id:9,
      iconClass: 'fas fa-poll',
      menuContent: 'Supplier Development',
      isExpanded: false
    },{ id:10,
      iconClass: 'fas fa-trophy',
      menuContent: 'Service Standards',
      isExpanded: false
    },{ id:11,
      iconClass: 'fas fa-bullhorn',
      menuContent: 'Announcements',
      isExpanded: false
    },{ id:12,
      iconClass: 'fas fa-code',
      menuContent: 'Product Development',
      isExpanded: false
    },{ id:13,
      menuContent: 'Beta Tools',
      isExpanded: false

    }];
  }

  toggleIcon (menu:any) {
    this.menuData.forEach((el)=> {
      if (el.id !== menu.id) {
        el.isExpanded = false;
      }
    });
    menu.isExpanded = !menu.isExpanded;
  }

}
