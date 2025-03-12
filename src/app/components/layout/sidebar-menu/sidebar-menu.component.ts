import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
// import { log } from 'console';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuData :any;
  isSidebarExpanded: boolean;

  constructor(private http:HttpClient) { }

  ngOnInit(): void { 
    this.isSidebarExpanded = true;
    this.sidebarItems();

  }

  toggleIcon (menu:any) {
    this.menuData.forEach((el)=> {
      if (el.id !== menu.id) {
        el.isExpanded = false;
      }
    });
    menu.isExpanded = !menu.isExpanded;
  }

  sidebarItems () {
    this.http.get('assets/site_2.json').subscribe((response) => {
      this.menuData = response;
    })
  }

  toggleMenu() { 
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
}
