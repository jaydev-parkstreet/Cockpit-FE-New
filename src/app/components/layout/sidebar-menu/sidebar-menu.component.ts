import { Component, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';
import { SidebarMenuService } from './sidebar-menu.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuData: any;
  isSidebarExpanded: boolean = false;
  isDropdownVisible: boolean = false;
  currentUserData: any;
  oldCockpit: string = environment.oldCockpit;
  currentRoute: any;
  allowedRoutes = ['product_management_system'];
  private hideTimeout: any;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private router: Router,
    private sidebarMenuService: SidebarMenuService
  ) { }

  ngOnInit(): void {
    this.currentUserData = this.authService.getUserData();
    this.currentRoute = this.router.url;
    this.getSidebarMenu();
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
    let topPosition = parentRect.top - 64;
    if (this.isSidebarExpanded) {
      this.renderer.removeStyle(submenuItem, 'position');
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
    }, 150);
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
        let topPosition = parentRect.top - 64;
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
          if (!this.isSidebarExpanded) {
            this.renderer.setStyle(submenuItem, 'display', 'none');
          }
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
        }, 150);
      }
    } else {
      return;
    }
  }

  /**
   * Function to open and close submenus in expanded mode menu
   * @author PSI-Enhancements
   */
  toggleMenuItems(menu: any) {
    this.menuData.forEach((menuItems) => {
      if (menuItems.id !== menu.id) {
        menuItems.isExpanded = false;
      }
    });
    menu.isExpanded = !menu.isExpanded;
  }


  /**
   * Function to get menu data & sidebar api
   * @author PSI-Enhancements
   */
  getSidebarMenu() {
    this.sidebarMenuService.getMenu().subscribe({
      next: (response) => {
        this.menuData = response.data.map((menu: any) => {
          //this below line needs to be removed as the icon is coming null for beta in api
          return menu.id === 495 ? { ...menu, icon: 'fas fa-hammer' } : menu;
        });
      },
      error: (error) => {
        this.menuData = [];
      }
    });
  }

  /**
   * Function to toggle sidebar mode between expanded and collapsed mode
   * @author PSI-Enhancements
   */
  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  /**
   * Function to toggle footer dropdown in sidebar
   * @author PSI-Enhancements
   */
  toggleDropdown(state: boolean) {
    clearTimeout(this.hideTimeout);
    if (state) {
      this.isDropdownVisible = true;
    } else {
      this.hideTimeout = setTimeout(() => {
        this.isDropdownVisible = false;
      }, 100);
    }
  }
  /**
   * Function to close the dropdown when clicking outside
   * @author PSI-Enhancements
   */
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.footer-profile')) {
      this.isDropdownVisible = false;
    }
  }

  /**
   * Function to logout user from the application
   * @author PSI-Enhancements
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Function to set active route
   * @author PSI-Enhancements
   */
  isActiveRoute(route: string): boolean {
    if (!route) return false;
      const currentPath = this.currentRoute.split('/').filter(Boolean).slice(0, 1).join('');
      const menuPath = route.split('/').pop();
      return currentPath === menuPath;
  }
}
