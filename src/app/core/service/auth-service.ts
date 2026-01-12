import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppRoutes } from '../constant/route.constant';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner-service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
	isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
	private userData: any;

	constructor(
		private http: HttpClient,
		private router: Router,
		private spinner: SpinnerService) {
	}

	/**
	 * Function to Recalculate Padding If Needed
	 * @param loginData
	 * @author PSI-Enhancements
	 */
	userLogin(loginData: any): any {
		return this.http
			.post(environment.apiUrl + AppRoutes.AUTHENTICATION.LOGIN, loginData)
			.toPromise();
	}

	/**
	 * Function for login.
	 * @param token
	 * @param userData
	 * @author PSI-Enhancements
	 */
	login(token: string, userData: any): void {
		localStorage.setItem('authToken', token);
		localStorage.setItem('userData', JSON.stringify(userData));
		this.userData = userData;
		this.isAuthenticatedSubject.next(true);
	}

	/**
	 * Function for logout.
	 * @author PSI-Enhancements
	 */
	logout(): void {
		const logout = this.logoutCall();
		logout.then((res) => {
			this.clearLocalStorage();
			// const iframe = document.getElementById('myframe') as HTMLInputElement;
			// iframe.src = environment.oldCockpit + '/router.php/logout';
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
				this.router.navigate(['/login']);
			}
		}).catch(error => {
		});
	}

	/**
	 * Function to call logout API.
	 * @author PSI-Enhancements
	 */
	async logoutCall() {
		this.spinner.show();
		try {
			const response = await this.http.get(environment.apiUrl + AppRoutes.AUTHENTICATION.LOGOUT).toPromise();
			return response;
		} catch (err) {
			return true;
		} finally {
			this.spinner.hide();
		}
	}
	/**
	 * Function to clear local storage.
	 * @author PSI-Enhancements
	 */
	clearLocalStorage() {
		localStorage.removeItem('authToken');
		localStorage.removeItem('userData');
		this.userData = null;
		this.isAuthenticatedSubject.next(false);
	}

	/**
	 * Function to get token.
	 * @author PSI-Enhancements
	 */

	getToken(): string | null {
		return localStorage.getItem('authToken');
	}

	/**
	 * Function to get user Data.
	 * @author PSI-Enhancements
	 */
	getUserData(): any {
		if (!this.userData) {
			const storedUserData = localStorage.getItem('userData');
			this.userData = storedUserData ? JSON.parse(storedUserData) : null;
		}
		return this.userData;
	}

	validTokenCall(token: any) {
		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		return this.http.get(environment.apiUrl + AppRoutes.AUTHENTICATION.CHECK_TOKEN, { headers }).toPromise();
	}
  
}
