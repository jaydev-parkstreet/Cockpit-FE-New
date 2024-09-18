import { Injectable } from '@angular/core';
import AppRoutes from 'src/app/app.routes';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PsiCustomFormService {

  constructor(private http: HttpClient) { }

  userLogin(filterData): any {
    return this.http
      .post(environment.apiUrl + AppRoutes.AUTHENTICATION.LOGIN, filterData)
      .toPromise();
  }
}
