import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuData = [];
  @Input() isSidebarExpanded:any;

  constructor() { }

  ngOnInit(): void { 
    this.isSidebarExpanded =true;
    this.menuData = [
      {
        id: 1,
        iconClass: 'fas fa-tachometer-alt',
        menuContent: 'Dashboard',
        isExpanded: false,
        iconPlus: false
      },
      {
        id: 2,
        iconClass: 'fas fa fa-home',
        menuContent: 'Gateway',
        isExpanded: false,
        iconPlus: false
      },
      {
        id: 3,
        iconClass: 'fas fa-sitemap',
        menuContent: 'Companies & Contacts',
        isExpanded: false,
        iconPlus: true,
        submenuItems: [{
          submenuContent: 'Companies & Contacts',
          href: environment.oldCockpit + '/router.php/crm#/dashboard'
        },
        {
          submenuContent: 'National Accounts',
          href: environment.oldCockpit + "/router.php/nationalaccounts#/"
        }]
      },
      {
        id: 4,
        iconClass: 'fas fa-glass-martini',
        menuContent: 'Suppliers',
        isExpanded: false,
        iconPlus: true,
        submenuItems: [{
          submenuContent: 'Supplier Management',
          href: environment.oldCockpit + '/router.php/app#!/cockpit/client-supplier-management'
        },
        {
          submenuContent: 'Profile Updates',
          href: environment.oldCockpit + '/router.php/client-profile-updates/view'
        },
        {
          submenuContent: 'Profile Overview',
          href: environment.oldCockpit + '/router.php/profiles-overview'
        },
        {
          submenuContent: 'Supplier Status',
          href: environment.oldCockpit + '/router.php/client/status#/'
        }]
      },
      {
        id: 5,
        iconClass: 'fas fa-dollar-sign',
        menuContent: 'Accounting',
        isExpanded: false,
        iconPlus: true,
        submenuItems: [{
          submenuContent: 'Bill Management',
          href: 'http://cockpit.parkstreet.local/router.php/app#!/cockpit/bill-management'
        },
        {
          submenuContent: 'Invoice Management',
          href: environment.oldCockpit + '/router.php/app#!/cockpit/invoice-management-summary'
        },
        {
          submenuContent: 'National Wholesale Scorecard',
          href: environment.oldCockpit + '/router.php/accounting/national-scorecard'
        },
        {
          submenuContent: 'Distribution Request',
          href: environment.oldCockpit + '/router.php/app/#!/cockpit/distribution-request'
        }]
      },
      {
        id: 6,
        iconClass: 'fas fa-cogs',
        menuContent: 'Operations',
        isExpanded: false,
        iconPlus: true,
        submenuItems: [{
          submenuContent: 'Product Management System',
          submenuLink: '/product-management'
        },
        {
          submenuContent: 'International Shipments',
          href: environment.oldCockpit + '/router.php/app/#!/cockpit/international-shipment'
        },
        {
          submenuContent: 'Order Management System',
          href: environment.oldCockpit + '/router.php/app/#!/order-management-system-v2'
        }]
      },
      {
        id: 7,
        iconClass: 'fas fa-stamp',
        menuContent: 'Compliance',
        isExpanded: false,
        iconPlus: true,
        submenuItems: [{
          submenuContent: 'State Registrations',
          submenuLink: 'http://cockpit.parkstreet.local/router.php/app/#!/cockpit/state-registrations'
        },
        {
          submenuContent: 'Monthly Reports',
          href: environment.oldCockpit + '/router.php/app/#!/cockpit/monthly-reports'
        }]
      },
      {
        id: 8,
        iconClass: 'fas fa-certificate',
        menuContent: 'Shared Services',
        isExpanded: false,
        iconPlus: true
      },
      {
        id: 9,
        iconClass: 'fas fa-poll',
        menuContent: 'Supplier Development',
        isExpanded: false,
        iconPlus: true
      },
      {
        id: 10,
        iconClass: 'fas fa-trophy',
        menuContent: 'Service Standards',
        isExpanded: false,
        iconPlus: true
      },
      {
        id: 11,
        iconClass: 'fas fa-bullhorn',
        menuContent: 'Announcements',
        isExpanded: false,
        iconPlus: true
      },
      {
        id: 12,
        iconClass: 'fas fa-code',
        menuContent: 'Product Development',
        isExpanded: false,
        iconPlus: true
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
