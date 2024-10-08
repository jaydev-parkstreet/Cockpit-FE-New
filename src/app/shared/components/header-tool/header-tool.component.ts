import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from './../../../components/authentication/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-tool',
  templateUrl: './header-tool.component.html',
  styleUrls: ['./header-tool.component.scss']
})
export class HeaderToolComponent implements OnInit {

  @Input() titleText: string;
  @Input() titleIcon: string;

  constructor(
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit(): void { }

  logout () {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
