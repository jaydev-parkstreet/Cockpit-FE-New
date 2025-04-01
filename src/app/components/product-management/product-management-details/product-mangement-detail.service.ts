import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import AppRoutes from 'src/app/app.routes';
import AppConstant from 'src/app/app.constant';

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

    /**
     * Retrieves the tab group configuration.
     * 
     * @returns {Array<Object>} - List of tab configurations with keys and labels.
     * @author PSI-Enhancement
     */
    getTabGroupConfig() {
      return [{
        key: 'notes',
        label: 'Notes'
      }, {
        key: 'attachments',
        label: 'Attachments'
      }, {
        key: 'auditTrail',
        label: 'Audit Trail'
      }];
    }
    
    /**
     * Checks and formats a value based on its content and an optional key.
     *
     * @param {string|number} value - The value to be checked and formatted.
     * @param {string} [key=''] - The optional key to determine if special formatting is required (e.g., 'abv').
     * @returns {string} The formatted value or '--' if the value is invalid.
     * @author PSI-Enhancement
     */
    valueChecker(value, key = '') {
      if (value && value !== '-') {
          if (key && key === 'abv') {
              return value + '%';
          } else {
              return value;
          }
      } else {
          return '--';
      }
    }

    /**
     * Retrieves the Filed Mappings.
     * 
     * @returns {Array<Object>} 
     * @author PSI-Enhancement
     */
    getFiledDetailsMapping() {
      return [
        { label: 'Supplier', key: 'client_name' },
        { label: 'Brand', key: 'brand' },
        { label: 'Sub-Brand Product', key: 'sub_brand_product_name' },
        { label: 'Description', key: 'description' },
        { label: 'Fanciful Name', key: 'fanciful_name' },
        { label: 'Group', key: 'group_name' },
        { label: 'Producer', key: 'producer_name' },
        { label: 'Case UOM', key: 'case_unit_of_measure' },
        { label: 'Container Type', key: 'container_type_name' },
        { label: 'Announced Price', key: 'ex_works_cost_formatted' },
        { label: 'Organic', key: 'is_organic_txt' },
        { label: 'Product Type', key: 'prod_type' },
        { label: 'Compliance', key: 'compliance_txt' },
        { label: 'Use Up', key: 'use_up_txt' }
      ];
    }

    /**
     * Maps and processes product fields to generate a response array with corresponding labels and values.
     *
     * @param {Object} row - The row of product data.
     * @returns {Array} The response array with labels and formatted values for the fields.
     * @author PSI-Enhancement
     */
    getFieldsDetail(row) {
      if(!row) return [];
      let fieldMappings = this.getFiledDetailsMapping();
      let response = fieldMappings.map(({ label, key }) => ({
          label,
          value: this.valueChecker(row[key])
      }));

      response = this.fieldsDetailResponse(row, response);
      response.push({ label: 'Date Created', value: this.valueChecker(row.created_date) });

      return response;
    }

    /**
     * Processes the product details and adds relevant fields to the response array 
     * based on the product type and its attributes.
     *
     * @param {Object} row - The row of product data.
     * @param {Array} response - The array to which the product details will be added.
     * @returns {Array} The updated response array with the relevant product details.
     * @author PSI-Enhancement
     */
    fieldsDetailResponse(row, response) {
      const prodTypeSubType = ['Bulk', 'Other', 'Wine', 'Malt', 'Spirits'];
      const prodTypeCategory = ['Wine', 'Spirits', 'Malt'];

      if(prodTypeSubType.includes(row.prod_type)) {
          response.push({
              label: 'Product Sub-Type',
              value: this.valueChecker(row.sub_type)
          });
      }

      if(prodTypeCategory.includes(row.prod_type)) {
          response.push({ 
              label: 'Category',
              value: this.valueChecker(row.category_name) 
          });
          response.push({ 
              label: 'Source',
              value: this.valueChecker(row.source) 
          });
          response.push({ 
              label: 'Country of Origin',
              value: this.valueChecker(row.country_name) 
          });
      }

      response.push({ 
          label: 'Manufactured Location',
          value: this.valueChecker(row.manufactured_location_address) 
      });

      response = this.fieldsDetailResponseCheck(row, response);
      return response;
    }

    /**
     * Checks the product type and adds relevant details to the response array.
     * 
     * @param {Object} row - The row of product data.
     * @param {Array} response - The array to which details will be added.
     * @returns {Array} The updated response array with the relevant product details.
     * @author PSI-Enhancement
     */
    fieldsDetailResponseCheck(row, response) {
      if (row.prod_type === 'Wine' || row.prod_type === 'Malt') {
          response.push({ 
              label: 'Vintage',
              value: this.valueChecker(row.vintage_text)
          });
      }

      if (row.prod_type === 'Wine') {
          response.push({ 
              label: 'Varietal',
              value: this.valueChecker(row.varietal)
          });
      }

      if (row.prod_type === 'Wine' || row.prod_type === 'Spirits' || row.prod_type === 'Malt') {
          response.push({ 
              label: 'ABV %',
              value: this.valueChecker(row.abv, 'abv')
          });
      }

      return response;
    }

    /**
     * Prepares the product code details for display by organizing the fields into a table format.
     *
     * @param {Object} productDetails - The details of the product.
     * @returns {Array} A configuration object containing the table headings and values of product code details.
     * @author PSI-Enhancement
     */
    prepareProductCodeDetails(productDetails) {
      const productCodeDetailFields = [
        { label: 'Park Street Product Code', val: productDetails.product_id || '--' },
        { label: 'COLA TTB', val: productDetails.cola_ttb_id || '--' },
        { label: 'UPC Code', val: productDetails.upc_code || '--' },
        { label: 'SCC Code', val: productDetails.scc_code || '--' },
        { label: 'Supplier Reference ID', val: productDetails.supplier_ref_id || '--' },
        { label: 'NABCA Code', val: productDetails.nabca_code || '--' },
        { label: 'UNIMERC Code', val: productDetails.unimerc_code || '--' },
        { label: 'BDN Code', val: productDetails.bdn_code || '--' }
      ];

      const productCodeDetailsConfig = [{
          table_headings: [
              { value: 'Type' },
              { value: 'Code' }
          ],
          table_values: productCodeDetailFields.map(field => [field.label, this.valueChecker(field.val)])
      }];

      return productCodeDetailsConfig;
    }

    /**
     * Function to get action buttons.
     *
     * @param {object} permissions 
     * @param {object} detail 
     * @returns {object} button-config
     * @author PSI-Enhancement
     */
    getActionButtons(permissions, detail) {
      let syncbtnName = detail.sync_status ? AppConstant.PRODUCT.SYNC_STATUS[detail.sync_status] : AppConstant.PRODUCT.SYNC_STATUS[3];
      let data = [];

      if (detail.status !== 'Approved' && detail.status !== 'Needs Action-Waiting on Supplier') {
          data.push({
              key: 'Needs Action-Waiting on Supplier',
              icon: 'fas fa-clock',
              showTooltip: true,
              tooltipText: 'Needs Action-Waiting on Supplier',
              permission: permissions.permissions.Update
          });
      }

      if (detail.status === 'Approved') {
          let syncClass = detail.sync_status === 1 ? 'fas fa-sync-alt' : 'fas fa-sync-alt pointer';
          data.push({
              key: 'Sync',
              showTooltip: true,
              icon: detail.sync_status === 2 ? 'fas fa-sync-alt fa-spin' : syncClass,
              tooltipText: syncbtnName,
              permission: permissions.permissions.Update
          });
      } else if (['Request Received', 'Needs Action-Waiting on Supplier', 'Pending'].includes(detail.status)) {
          data.push({
              key: 'Pre-Approved',
              showTooltip: true,
              icon: 'fas fa-check-circle pointer',
              tooltipText: 'Pre-Approved',
              permission: permissions.permissions.Update
          });
      } else {
          data.push({
              key: 'Approve',
              showTooltip: true,
              icon: 'fas fa-check-circle pointer',
              tooltipText: 'Approve',
              permission: permissions.permissions.Update
          });
      }

      data.push(
          {
              key: 'edit',
              icon: 'fas fa-pen',
              showTooltip: true,
              tooltipText: 'Edit',
              permission: permissions.permissions.Update && permissions.permissions.Create
          },
          {
              key: 'duplicate',
              icon: 'fas fa-clone',
              showTooltip: true,
              tooltipText: 'Duplicate',
              permission: permissions.permissions.Create
          }
      );

      data.push({
          key: 'Activate',
          icon: detail.is_active !== 1 ? 'fas fa-check-circle' : 'fas fa-times-circle',
          button: detail.is_active !== 1 ? 'Activate' : 'Deactivate',
          showTooltip: true,
          tooltipText: detail.is_active !== 1 ? 'Activate' : 'Deactivate',
          permission: permissions.permissions.Update
      });

      return data;
    }

    /**
     * Formats a given key by replacing underscores with spaces and capitalizing each word.
     *
     * @param {string} key 
     * @returns {string}
     * @author PSI-Enhancement
     */
    formatKey(key) {
      return key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Function to prepare data for product management system CRUD form.
     * 
     * @param none
     * @returns Array of Object of Mappings
     * @author PSI-Enhancement
     */
    getDetailsAuditTrailConfigApiRequest () {
      return [
        { data: 'client_name', label: 'Supplier:', typeOfFilter: null},
        { data: 'sub_brand_product_name', label: 'Sub-Brand Product:', typeOfFilter: null },
        { data: 'description', label: 'Description:', typeOfFilter: null },
        { data: 'name', label: 'Fanciful Name:', typeOfFilter: null },
        { data: 'group_name', label: 'Group:', typeOfFilter: null },
        { data: 'producer_name', label: 'Producer:', typeOfFilter: null },
        { data: 'case_unit_of_measure', label: 'Case UOM:', typeOfFilter: null },
        { data: 'ex_works_cost', label: 'Announced Price:', typeOfFilter: null },
        { data: 'prod_type', label: 'Product Type:', typeOfFilter: null },
        { data: 'compliance', label: 'Compliance:', typeOfFilter: null },
        { data: 'use_up', label: 'Use Up:', typeOfFilter: null },
        { data: 'created_date', label: 'Date Created:', typeOfFilter: null },
        { data: 'sub_type', label: 'Product Sub-Type:', typeOfFilter: null },
        { data: 'category_name', label: 'Category:', typeOfFilter: null },
        { data: 'source', label: 'Source:', typeOfFilter: null },
        { data: 'country_name', label: 'Country of Origin:', typeOfFilter: null },
        { data: 'vintage', label: 'Vintage:', typeOfFilter: null },
        { data: 'varietal', label: 'Varietal:', typeOfFilter: null },
        { data: 'abv', label: 'ABV %:', typeOfFilter: null },
        { data: 'unit_length', label: 'Bottle / Unit | Length:', typeOfFilter: null },
        { data: 'unit_width', label: 'Bottle / Unit | Width:', typeOfFilter: null },
        { data: 'unit_height', label: 'Bottle / Unit | Height:', typeOfFilter: null },
        { data: 'unit_weight', label: 'Bottle / Unit | Weight:', typeOfFilter: null },
        { data: 'case_length', label: 'Case | Length:', typeOfFilter: null },
        { data: 'case_width', label: 'Case | Width:', typeOfFilter: null },
        { data: 'case_height', label: 'Case | Height:', typeOfFilter: null },
        { data: 'case_weight', label: 'Case | Weight:', typeOfFilter: null },
        { data: 'pallet_length', label: 'Pallet | Length:', typeOfFilter: null },
        { data: 'pallet_width', label: 'Pallet | Width:', typeOfFilter: null },
        { data: 'pallet_height', label: 'Pallet | Height:', typeOfFilter: null },
        { data: 'pallet_weight', label: 'Pallet | Weight:', typeOfFilter: null },
        { data: 'layers_per_pallet', label: 'Layers per Pallet:', typeOfFilter: null },
        { data: 'cases_per_layer', label: 'Cases per Layer:', typeOfFilter: null },
        { data: 'cases_per_pallet', label: 'Cases per Pallet:', typeOfFilter: null },
        { data: 'product_id', label: 'Park Street Product Code:', typeOfFilter: null },
        { data: 'upc_code', label: 'UPC Code:', typeOfFilter: null },
        { data: 'scc_code', label: 'SCC Code:', typeOfFilter: null },
        { data: 'system_id', label: 'Supplier Reference ID:', typeOfFilter: null },
        { data: 'cola_ttb_id', label: 'COLA TTB ID:', typeOfFilter: null },
        { data: 'nabca_code', label: 'NABCA Code:', typeOfFilter: null },
        { data: 'unimerc_code', label: 'UNIMERC Code:', typeOfFilter: null },
        { data: 'bdn_code', label: 'BDN Code:', typeOfFilter: null },
        { data: 'status', label: 'Product Status:', typeOfFilter: null },
        { data: 'is_active_txt', label: 'Active Status:', typeOfFilter: null }
        ];
    }
}


