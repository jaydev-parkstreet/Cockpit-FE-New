import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
// import { log } from 'console';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';

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
  currentRoute: any ;
  // @ViewChild('submenuItem') submenuItem: any;

  constructor(
    private http:HttpClient,
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.getUserData();
    this.currentRoute = this.router.url;
    console.log('Current Route:', this.currentRoute);
    this.sidebarItems();
  }

  showSubmenu(event: MouseEvent, anchorElement: HTMLElement) {
    const submenuItem = anchorElement.parentElement as HTMLElement;
    if (!submenuItem) return;

    const submenuElement = submenuItem.querySelector('.submenu-item') as HTMLElement;
    if (!submenuElement) return;
    const parentRect = submenuItem.getBoundingClientRect();
    this.renderer.setStyle(submenuElement, 'top', `${parentRect.top}px`);
    this.renderer.setStyle(submenuElement, 'display', 'block');
  }

  hideSubmenu(event: MouseEvent, anchorElement: HTMLElement) {

    const submenuItem = anchorElement.parentElement as HTMLElement;
    if (!submenuItem) return;

    const submenuElement = submenuItem.querySelector('.submenu-item') as HTMLElement;
    if (!submenuElement) return;
    this.renderer.setStyle(submenuElement, 'display', 'none');
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

  isActiveRoute(route: string): boolean {
    if (!route) return false;
    const currentPath = this.currentRoute.split('/').pop();
    const menuPath = route.split('/').pop();
    console.log(currentPath , menuPath);
    return currentPath === menuPath;
  }
}
