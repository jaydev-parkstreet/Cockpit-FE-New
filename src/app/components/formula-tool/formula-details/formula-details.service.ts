import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import AppRoutes from 'src/app/app.routes';
import AppConstant from 'src/app/app.constant';

@Injectable({
  providedIn: 'root'
})
export class formulaDetailService {

    constructor(
      private http: HttpClient
    ) { }

    /**
     * Retrieves the tab group configuration.
     * 
     * @returns {Array<Object>} - List of tab configurations with keys and labels.
     * @author PSI-VIII
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
     * @author PSI-VIII
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
     * @author PSI-VIII
     */
    getFiledDetailsMapping() {
      return [
        { label: 'Supplier', key: 'client_name' },
        { label: 'Formula description', key: 'formula_description', tooltip: 'Basic description of the Product/Formula (e.g., Grey Goose Orange Vodka).',
          iconClass: 'fas fa-info-circle' },
        { label: 'Product Origin', key: 'product_origin' },
        { label: 'Product Type', key: 'product_type' },
        { label: 'Additional Information', key: 'notes' },
        { label: 'Classification', key: 'classification_name' },
        { label: 'Submission ID', key: 'submission_id' },
        { label: 'Formula ID', key: 'formula_id' },
        { label: 'Date Requested', key: 'date_requested' },
        { label: 'Requested By', key: 'requested_by' },
        { label: 'Commodity Statement', key: 'commodity_statement' },
        { label: 'Statement of Composition', key: 'commodity_statement_request' },
        { label: 'Total Batch Size', key: 'total_batch_size' },
        { label: 'Batch Size Unit of Measure', key: 'batch_size_unit_of_measure' },
        { label: 'Sample Received', key: 'sample_received' },
        { label: 'Date Submitted', key: 'date_submitted' }
      ];
    }

    /**
     * Maps and processes formula fields to generate a response array with corresponding labels and values.
     *
     * @param {Object} row - The row of formula data.
     * @returns {Array} The response array with labels and formatted values for the fields.
     * @author PSI-VIII
     */
    getFieldsDetail(row: any) {
      if (!row) return [];
      let fieldMappings = this.getFiledDetailsMapping();
    
      return fieldMappings.map(({ label, key, tooltip, iconClass }) => {
        let value = row[key];
    
        if (key === 'product_origin') {
          switch (value) {
            case 'D': value = 'Domestic (U.S.)'; break;
            case 'I': value = 'Imported (Non-U.S.)'; break;
          }
        }
    
        return {
          label,
          value: this.valueChecker(value),
          tooltip,
          iconClass
        };
      });
    }

    /**
     * Function to get action buttons.
     *
     * @param {object} permissions 
     * @param {object} detail 
     * @returns {object} button-config
     * @author PSI-VIII
     */
    getActionButtons(permissions, detail) {
      let data = [];
      data.push(
          {
              key: 'edit',
              icon: 'fas fa-pen',
              showTooltip: true,
              tooltipText: 'Edit',
              permission: permissions.permissions.Update && permissions.permissions.Create
          },
      );

      data.push({
          key: 'Archive',
          icon: 'fas fa-archive action-icon',
          button: detail.is_archived !== 1 ? 'Archive' : 'Unarchive',
          showTooltip: true,
          tooltipText: detail.is_archived !== 1 ? 'Archive' : 'Unarchive',
          permission: permissions.permissions.Update
      });

      return data;
    }

    /**
     * Formats a given key by replacing underscores with spaces and capitalizing each word.
     *
     * @param {string} key 
     * @returns {string}
     * @author PSI-VIII
     */
    formatKey(key) {
      return key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, char => char.toUpperCase());
    }

    /**
     * Function to prepare data for formula audi trail.
     * 
     * @param none
     * @returns Array of Object of Mappings
     * @author PSI-VIII
     */
    getDetailsAuditTrailConfigApiRequest () {
      return [
            { data: 'id', label: 'UNIQUE ID', typeOfFilter: null },
            { data: 'client_name',label: 'Supplier', typeOfFilter: null},
            { data: 'formula_fids_file', label: 'Formula FIDS File:', typeOfFilter: null },
            { data: 'formula_document_approval_file', label: 'Formula Document Approval File:', typeOfFilter: null },
            { data: 'date_requested', label: 'Requested Date:', typeOfFilter: null },
            { data: 'requested_by', label: 'Requested By:', typeOfFilter: null },
            { data: 'date_submitted', label: 'Submitted Date:', typeOfFilter: null },
            { data: 'date_approved', label: 'Approved Date:', typeOfFilter: null },
            { data: 'date_expired', label: 'Expired Date:', typeOfFilter: null },
            { data: 'commodity_statement', label: 'Commodity Statement:', typeOfFilter: null },
            { data: 'commodity_statement_request', label: 'Statement of Composition:', typeOfFilter: null },
            { data: 'formula_description', label: 'Formula Description:', typeOfFilter: null },
            { data: 'formula_status', label: 'Formula Status:', typeOfFilter: null },
            { data: 'no_expiration_date', label: 'No Expiration Date:', typeOfFilter: null },
            { data: 'product_origin', label: 'Product Origin:', typeOfFilter: null },
            { data: 'product_type', label: 'Product Type:', typeOfFilter: null },
            { data: 'total_batch_size', label: 'Total Batch Size:', typeOfFilter: null },
            { data: 'classification_name', label: 'Classification:', typeOfFilter: null },
            { data: 'sample_received', label: 'Sample Received:', typeOfFilter: null },
            { data: 'submission_id', label: 'Submission ID:', typeOfFilter: null },
            { data: 'is_archived', label: 'Is Archived:', typeOfFilter: null },
            { data: 'ps_user', label: 'PS User:', typeOfFilter: null },
            { data: 'edit_mode', label: 'Edit Mode:', typeOfFilter: null },
            { data: 'document_link', label: 'Document Link:', typeOfFilter: null },
            { data: 'is_admin', label: 'Is Admin:', typeOfFilter: null },
            { data: 'notes', label: 'Notes:', typeOfFilter: null }
        ];
    }
}
