import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import AppRoutes from 'src/app/app.routes';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  private userData: any;

  constructor(
    private http: HttpClient,
   private router: Router,private commonService: CommonService) {
    this.checkToken();
  }

  login(token: string, userData: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.userData = userData;
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    const logout = this.logoutCall();
    logout.then((res) => {
      this.clearLocalStorage();
      const iframe = document.getElementById('myframe') as HTMLInputElement;
      iframe.src = environment.oldNavigator + '/router.php/logout';
      let loginUrl = 'login';
      const url = new URL(window.location.href);
  
      if (url.searchParams.get('r')) {
        loginUrl += '?r=' + url.searchParams.get('r');
      }
  
      if (url.searchParams.get('c')) {
        loginUrl += loginUrl.includes('?') ? '&c=' : '?c=';
        loginUrl += url.searchParams.get('c');
      }
  
      if (url.searchParams.get('r') || url.searchParams.get('c')) {
        window.location.href = loginUrl;
      } else {
       this.router.navigate(['/login'], { queryParams: { reload: true } });
      }
    }).catch(error => {
    });
  }
  

    async logoutCall() {
        this.commonService.showSpinner();
        try {
            const response = await this.http.get(environment.apiUrl + AppRoutes.AUTHENTICATION.LOGOUT).toPromise();
            return response;
        } catch (err) {
            return true;
        } finally {
            this.commonService.hideSpinner();
        }
    }
  

  clearLocalStorage() {
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
