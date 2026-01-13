import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppRoutes } from '../../../core/constant/route.constant';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {

  constructor(private http: HttpClient) {}

  getMenu(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + AppRoutes.COMMON.SIDEBAR_MENU);
  }
  
}
