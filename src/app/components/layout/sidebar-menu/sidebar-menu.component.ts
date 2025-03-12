import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
// import { log } from 'console';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../authentication/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuData :any;
  isSidebarExpanded: boolean = true;
  isDropdownVisible : boolean = false;
  currentUserData: any;
  oldCockpit: string = environment.oldCockpit;

  constructor(
    private http:HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.getUserData()
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

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  logout(): void {
    this.authService.logout();
  }
}
