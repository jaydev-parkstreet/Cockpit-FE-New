import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
      return this.http.post("https://stgapi.parkstreet.com/v1/shipments/summary",summaryData,{ headers }).toPromise();
    }

  }


