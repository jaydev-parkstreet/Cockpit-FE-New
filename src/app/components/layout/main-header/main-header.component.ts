import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './../../../components/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {
  isDropdownOpen = false;
  constructor(
    private authService:AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
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
    this.router.navigate(['/login']);
  }


}
