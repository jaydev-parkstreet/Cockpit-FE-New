import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Renderer2 } from '@angular/core';
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
    const viewportHeight = window.innerHeight;
    this.renderer.setStyle(submenuElement, 'visibility', 'hidden');
    this.renderer.setStyle(submenuElement, 'display', 'block');
    const submenuHeight = submenuElement.offsetHeight;
    this.renderer.setStyle(submenuElement, 'display', 'none');
    this.renderer.setStyle(submenuElement, 'visibility', 'visible');
    let topPosition = parentRect.top;
    if (this.isSidebarExpanded) {
      if (topPosition + submenuHeight > viewportHeight) {
        this.renderer.setStyle(submenuElement, 'bottom', `16px`);
      } else {
        this.renderer.setStyle(submenuElement, 'top', `${topPosition - 16}px`);

      }
      this.renderer.setStyle(submenuElement, 'left', `calc(100% - 16px)`);
    } else {
      this.renderer.setStyle(submenuItem, 'position', `relative`);
      if (topPosition + submenuHeight > viewportHeight) {
        this.renderer.setStyle(submenuElement, 'bottom', `16px`);
      } else {
        this.renderer.setStyle(submenuElement, 'top', `-16px`);
      }
      this.renderer.setStyle(submenuElement, 'left', `calc(100% + 8px)`);
    }
    this.renderer.setStyle(submenuElement, 'display', 'block');
    submenuElement.addEventListener('mouseenter', () => {
      this.renderer.setStyle(submenuElement, 'display', 'block');
    });
    submenuElement.addEventListener('mouseleave', () => {
      this.renderer.setStyle(submenuElement, 'display', 'none');
    });
  }

  hideSubmenu(event: MouseEvent, anchorElement: HTMLElement) {
    const submenuItem = anchorElement.parentElement as HTMLElement;
    if (!submenuItem) return;
    const submenuElement = submenuItem.querySelector('.submenu-item') as HTMLElement;
    if (!submenuElement) return;
    setTimeout(() => {
      if (!submenuElement.matches(':hover')) {
        this.renderer.setStyle(submenuElement, 'display', 'none');
      }
    }, 100);
  }

  showMenu(event: MouseEvent, anchorElement: HTMLElement) {
    if (!this.isSidebarExpanded) {
      const menuItem = anchorElement.parentElement as HTMLElement;
      if (!menuItem) return;
      const submenuItem = anchorElement.nextElementSibling as HTMLElement;
      if (submenuItem && submenuItem.tagName === 'UL') {
        const parentRect = menuItem.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        this.renderer.setStyle(submenuItem, 'visibility', 'hidden');
        this.renderer.setStyle(submenuItem, 'display', 'block');
        const submenuHeight = submenuItem.offsetHeight;
        this.renderer.setStyle(submenuItem, 'display', 'none');
        this.renderer.setStyle(submenuItem, 'visibility', 'visible');
        let topPosition = parentRect.top;
        if (topPosition + submenuHeight > viewportHeight) {
          this.renderer.setStyle(submenuItem, 'bottom', `16px`);
        } else {
          this.renderer.setStyle(submenuItem, 'top', `${topPosition}px`);
        }
        this.renderer.setStyle(submenuItem, 'left', `calc(100% - 8px)`);
        this.renderer.setStyle(submenuItem, 'display', 'block');
        submenuItem.addEventListener('mouseenter', () => {
          this.renderer.setStyle(submenuItem, 'display', 'block');
        });
        submenuItem.addEventListener('mouseleave', () => {
          this.renderer.setStyle(submenuItem, 'display', 'none');
        });
      }
    } else {
      return;
    }
  }
  
  hideMenu(event: MouseEvent, anchorElement: HTMLElement) {
    if (!this.isSidebarExpanded) {
      const submenuItem = anchorElement.nextElementSibling as HTMLElement;
      if (submenuItem && submenuItem.tagName === 'UL') {
        setTimeout(() => {
          if (!submenuItem.matches(':hover')) {
            this.renderer.setStyle(submenuItem, 'display', 'none');
          }
        }, 100);
      }
    } else {
      return;
    }
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
    return currentPath === menuPath;
  }
}
