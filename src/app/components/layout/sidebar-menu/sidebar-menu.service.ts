import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import AppRoutes from 'src/app/app.routes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarMenuService {

  constructor(private http: HttpClient) { }

  /**
   * Function to call sidebar API
   * @author PSI-Enhancements
   */
  getMenu(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + AppRoutes.COMMON.SIDEBAR_MENU);
  }
}
