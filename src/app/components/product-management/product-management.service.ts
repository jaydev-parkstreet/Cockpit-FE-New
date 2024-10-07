import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductManagementService {

  constructor(private http:HttpClient) { }



   /**
     * Function to get top bar config.
     * @createdDate 19-09-2024
     * @author PSI-Enhancements
     */
  getSummaryTopBarConfig() {
    return {
      filtersConfig: {
        totalResult: 0,
        filterArray:[

        ]
      },
      placeholder: 'Search',
      searchText: '',
      searchOptions: {},
      expandFilter: false,
      actions: []
    } 
  };


    getSummary (summaryData:any,token) {
     
      const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
      return this.http.post(environment.apiUrl +"product-tool/summary",summaryData,{ headers }).toPromise();
    }

    getDropdown () {
     
      const headers = new HttpHeaders().set('Authorization',`Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOjI3OCwiYWxsb3dfYWRtaW5fY2xpZW50cyI6MSwiaXNBZG1pbiI6dHJ1ZSwiSXNVc2VyQWZmaWxpYXRlZCI6dHJ1ZSwicGVyc29uX2lkIjo2MTgsImlzT3BlblVzZXIiOmZhbHNlLCJkZWZhdWx0X3R5cGUiOjEsImN1c3RvbWVyX2lkIjowLCJpc0N1c3RvbWVyQ29tcGFueSI6ZmFsc2UsIm1hcmtldF9wbGFjZSI6MSwiaXNfZnJlZV91c2VyIjpmYWxzZSwiaXNGcmVlQ29tcGFueSI6ZmFsc2UsInVzZXJuYW1lIjoibnNlcmFmaW5pIiwiZnVsbF9uYW1lIjoiTmlubyBTZXJhZmluaSIsImZpcnN0X25hbWUiOiJOaW5vIiwibGFzdF9uYW1lIjoiU2VyYWZpbmkiLCJlbWFpbCI6Im5zZXJhZmluaUBwYXJrc3RyZWV0LmNvbSIsInRlcm1zX2FjY2VwdGVkIjoxLCJkZXBsZXRpb25fYWNjZXB0ZWQiOjEsImRpc3BsYXlfYW5ub3VuY2VtZW50X3N0YXR1cyI6MCwicGVybWlzc2lvbnMiOnsiYWxsb3dfYWRtaW5fY2xpZW50cyI6MSwiYWxsb3dfc2FsZXNfYnlfZGF0ZV9yYW5nZSI6MSwiYWxsb3dfc2FsZXNfYnlfbW9udGgiOjEsImFsbG93X2N1c3RvbWVyX2JhbGFuY2VfcmVwb3J0IjoxLCJhbGxvd19pbnZlbnRvcnkiOjEsImFsbG93X2Nhc2hfcmVwb3J0IjoxLCJhbGxvd19kb2N1bWVudF9jZW50ZXIiOjEsImFsbG93X3Bhcmtfc3RyZWV0X2lwdCI6MSwiYWxsb3dfcGFya19zdHJlZXRfdW5pdmVyc2l0eSI6MSwiYWxsb3dfc3luY19tYW5hZ2VyIjoxLCJhbGxvd19kZXBsZXRpb25fcmVwb3J0IjoxLCJhbGxvd19pbmR1c3RyeV9jb25uZWN0IjoxLCJhbGxvd19zdGF0ZV9yZWd1bGF0aW9ucyI6MSwiYWxsb3dfYWRtaW5fcmVxX2Rpc3QiOjF9LCJpc18yRkFfYWN0aXZlIjowLCJ2ZXJpZmljYXRpb25fdHlwZSI6InNtcyIsInBob25lX25vIjpudWxsLCJpc19lbWFpbF92ZXJpZmllZCI6MSwic2hvd19uZXdfbmF2aWdhdGlvbiI6MSwic2hvd19uYXZpZ2F0aW9uX2Jhbm5lciI6MSwicmVzdHJpY3RfY29tcGV0aXRpb25fbWFuYWdlcl9uYXZpZ2F0aW9uIjp0cnVlLCJpc193aG9sZXNhbGVyIjpmYWxzZSwiY2xpZW50SWRzIjoiNTgzIiwiYWxsX2NsaWVudHNfc2VsZWN0ZWQiOmZhbHNlLCJjbGllbnRzIjpbIjgwMDAwNERFLTE0NzU2ODI5OTgiXSwiY29tcGFuaWVzIjpbXSwiY29tcGFueV9jaGFuZ2UiOjEsInVzZUNvbXBhbnlJZCI6ZmFsc2UsImlzTWFrZXIiOmZhbHNlfSwiZXhwIjoxNzI3ODg1Nzk4fQ.KX9INsOQWSEjuoOysRKGe5J02W7bQKJCxMLv6dTB_9U`);
     
       console.log(headers, )
      return this.http.get(environment.apiUrl +"product-tool/dropdown", { headers }).toPromise();
    }
  }


