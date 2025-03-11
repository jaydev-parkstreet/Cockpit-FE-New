import { Injectable } from '@angular/core';
import AppRoutes from 'src/app/app.routes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsiCustomFormService {

  constructor(
    private http: HttpClient
  ) { }

 /**
   Function to Recalculate Padding If Needed
   * @param loginData
   * @author PSI-Enhancements
   */  
  userLogin(loginData): any {
    return this.http
      .post(environment.apiUrl + AppRoutes.AUTHENTICATION.LOGIN, loginData)
      .toPromise();
  }

}
