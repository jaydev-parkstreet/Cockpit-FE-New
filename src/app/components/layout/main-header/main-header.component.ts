import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../../components/authentication/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  isSidebarExpanded = true;
  isDropdownOpen = false;
  currentUserData: any;
  oldCockpit: string = environment.oldCockpit;
  @Output() menuState = new EventEmitter<any>();
  constructor(
    private authService:AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.currentUserData = this.authService.getUserData()
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.isDropdownOpen && !target.closest('.dropdown')) {
      this.closeDropdown();
    }
  }
  logout(): void {
    this.authService.logout();
  }

  toggleMenu() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
    this.menuState.emit(this.isSidebarExpanded);
  }

}
