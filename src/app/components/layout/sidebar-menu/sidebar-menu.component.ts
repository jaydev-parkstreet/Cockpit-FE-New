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
    allowedRoutes = ['product_management_system', 'cola_formula'];
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
    * Function to show sub menus on mouseover
    * @author PSI-Enhancements
    */
    showSubmenu(event: MouseEvent, anchorElement: HTMLElement) {
        const submenuItem = anchorElement.parentElement as HTMLElement;
        const submenuElement = submenuItem.querySelector('.submenu-item') as HTMLElement;
        if (!submenuItem || !submenuElement) return;

        const parentRect = submenuItem.getBoundingClientRect();
        const submenuHeight = this.calculateOffsetHeight(submenuElement);
        const isOverflowing = parentRect.top + submenuHeight > window.innerHeight;

        if (this.isSidebarExpanded) {
            this.renderer.removeStyle(submenuItem, 'position');
        } else {
            this.renderer.setStyle(submenuItem, 'position', 'relative');
        }

        if (isOverflowing) {
            this.renderer.removeStyle(submenuElement, 'top');
            this.renderer.setStyle(submenuElement, 'bottom', '16px');
        } else {
            this.renderer.removeStyle(submenuElement, 'bottom');
            this.renderer.setStyle(submenuElement, 'top', this.isSidebarExpanded ? `${parentRect.top - 16}px` : '-16px');
        }

        this.renderer.setStyle(submenuElement, 'left', `calc(100% ${this.isSidebarExpanded ? '- 16px' : '+ 8px'})`);
        this.renderer.setStyle(submenuElement, 'display', 'block');
        submenuElement.addEventListener('mouseenter', () => {
            this.renderer.setStyle(submenuElement, 'display', 'block');
        });
        submenuElement.addEventListener('mouseleave', () => {
            this.renderer.setStyle(submenuElement, 'display', 'none');
        });
    }

    /**
     * Function to Hide Submenu on mouseleave
     */
    hideSubmenu(event: MouseEvent, anchorElement: HTMLElement) {
        const submenuItem = anchorElement.parentElement as HTMLElement;
        const submenuElement = submenuItem.querySelector('.submenu-item') as HTMLElement;
        if (!submenuItem || !submenuElement) return;
        setTimeout(() => {
            if (!submenuElement.matches(':hover')) {
                this.renderer.setStyle(submenuElement, 'display', 'none');
            }
        }, 150);
    }

    /**
    * Function to Show Menu on mouseover 
    * @author PSI-Enhancements
    */
    showMenu(event: MouseEvent, anchorElement: HTMLElement) {
        if (this.isSidebarExpanded) return;
        const menuItem = anchorElement.parentElement as HTMLElement;
        const submenuItem = anchorElement.nextElementSibling as HTMLElement;
        if (!menuItem || !submenuItem || submenuItem.tagName !== 'UL') return;

        const parentRect = menuItem.getBoundingClientRect();
        const submenuHeight = this.calculateOffsetHeight(submenuItem);
        const isOverflowing = parentRect.top + submenuHeight > window.innerHeight;

        this.renderer.setStyle(submenuItem, isOverflowing ? 'bottom' : 'top', isOverflowing ? '16px' : `${parentRect.top}px`);
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
  
    /**
     * Function to Hide Menu on mouseleave
     */
    hideMenu(event: MouseEvent, anchorElement: HTMLElement) {
        if (this.isSidebarExpanded) return;
        const submenuItem = anchorElement.nextElementSibling as HTMLElement;
        if (!submenuItem || submenuItem.tagName !== 'UL') return;
        setTimeout(() => {
            if (!submenuItem.matches(':hover')) {
                this.renderer.setStyle(submenuItem, 'display', 'none');
            }
        }, 150);
    }

    /**
     * Function to Calculate offset height of element
     * @author PSI-Enhancements
     */
    calculateOffsetHeight (submenuElement: HTMLElement) {  
        this.renderer.setStyle(submenuElement, 'visibility', 'hidden');
        this.renderer.setStyle(submenuElement, 'display', 'block');
        const submenuHeight = submenuElement.offsetHeight;
        this.renderer.setStyle(submenuElement, 'display', 'none');
        this.renderer.setStyle(submenuElement, 'visibility', 'visible');
        return submenuHeight;
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
                    return menu;
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
