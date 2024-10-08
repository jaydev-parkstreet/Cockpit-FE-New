import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import AppRoutes from 'src/app/app.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor( private http: HttpClient ) { 
    this.checkToken();
  }

  login(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  getToken() : string | null {
    return localStorage.getItem('authToken');
  }

  // selectClient(token) {
  //   let clients = {
  //     "clients": [
  //       "583"
  //     ]
  //   }
  //   return this.http
  //   .post(environment.apiUrl + 'select-clients', clients , token)
  //   .toPromise();
  // }

  private checkToken(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }
}
