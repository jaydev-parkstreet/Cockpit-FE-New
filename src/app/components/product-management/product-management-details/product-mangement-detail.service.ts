import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import AppRoutes from 'src/app/app.routes';

@Injectable({
  providedIn: 'root'
})
export class ProductMangementDetailService {

    constructor(
      private http: HttpClient
    ) { }

    /**
     * Syncs the product order with NS.
     * @param productId
     * @returns An Observable containing the response from the server.
     * @author psi-enhancement
     */
    syncOrder(productId) {
      let params = {
          'productId' : productId
      };
      return this.http
          .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.NS_SYNC, params)
          .pipe(map((response :any) => response.data));
    }
    
    /**
     * Fetches the sync status details for a product
     * @param id
     * @returns An observable containing the sync status details
     * @author psi-enhancement
     */
    getSyncStatusDetails(id) {
      return this.http
        .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.NS_SYNC_STATUS + id)
        .pipe(map((response :any) => response));
    }

    /**
     * Retrieves the approval status of a product from the server.
     *
     * @param productId
     * @returns An Observable containing the API response for the approval status of the product.
     * @author psi-enhancement
     */
    getApproveAPI(productId) {
        const params = { product_id: productId };
        return this.http
          .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_APPROVE, { params })
          .pipe(map((response :any) => response));
    }

    /**
     * Retrieves the Pre Approve API response from the server for a given product ID.
     *
     * @param productId
     * @returns An Observable containing the Pre Approve API response.
     * @author psi-enhancement
     */
    getPreApproveAPI(productId) {
      const params = { product_id: productId };
      return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_PRE_APPROVE, { params })
        .pipe(map((response :any) => response));
    }

    /**
     * Gets the Need Action API response from the server.
     *
     * @param productId
     * @returns An Observable containing the Need Action API response.
     * @author psi-enhancement
     */
    getNeedActionAPI(productId) {
      const params = { product_id: productId };
      return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_NEED_ACTION, { params })
        .pipe(map((response :any) => response));
    }
}

