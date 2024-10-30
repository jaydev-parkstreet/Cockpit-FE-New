import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private userData: any;

  constructor(private http: HttpClient) { 
    this.checkToken();
  }

  login(token: string, userData: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.userData = userData;
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    this.userData = null;
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUserData(): any {
    if (!this.userData) {
      const storedUserData = localStorage.getItem('userData');
      this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    }
    return this.userData;
  }

  private checkToken(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
    if (token) {
      const storedUserData = localStorage.getItem('userData');
      this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    }
  }
}
