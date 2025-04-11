import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from 'src/app/core/services/common.service';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormulaCrudService {

        constructor(
                private commonService: CommonService,
                private http: HttpClient
        ) { }

        /**
         * Format the model for the formula tool API.
         * @param model the model data
         * @param filtersList the filters list
         * @param edit whether the form is in edit mode
         * @param duplicate whether the form is in duplicate mode
         * @param id the formula id
         * @returns the formatted model
         * @author PSI-VIII
         */
        formatModelFormulaTool(model: any, filtersList: any, edit: boolean, duplicate: boolean, id: number): any {
            if (!Object.keys(model).length) {
          return {};
            }

            let modelFormat: any = {
          name: model.name || "",
          description: model.description || "",
          ingredient: Array.isArray(model.ingredient) && model.ingredient.length > 0
              ? model.ingredient.map((item: any) => ({
            id: item.id || null,
            name: item.name || null,
            quantity: item.quantity || null,
            unit: item.unit || null
              }))
              : [],
          compliance: model.compliance === "1" ? 1 : 0,
          is_organic: model.is_organic ? 1 : 0,
          use_up: model.use_up === "1" ? 1 : 0,
          abv: model.abv || "",
          cola_ttb_id: model.cola_ttb_id || "",
          nabca_code: model.nabca_code || "",
          bdn_code: model.bdn_code || "",
          unimerc_code: model.unimerc_code || "",
          client_id: model.client_id || "",
          system_id: model.system_id || "",
          scc_code: model.scc_code || "",
          upc_code: model.upc_code || ""
            };

            if (edit && !duplicate) {
          modelFormat.id = id;
            }

            if (duplicate) {
          modelFormat.id = null;
            }

            return modelFormat;
        }

        /**
         * Fetches the configuration for formula CRUD fields.
         * 
         * @param filtersList
         * @returns The form field configuration.
         * @author PSI-VIII
         */
        getFormulaFieldConfig(filtersList) {
                return {
                        leftSection: [
                                {
                                  key: 'id',
                                  name: 'id',
                                  label: 'UNIQUE ID',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Unique ID')
                                },
                                {
                                  key: 'client_name',
                                  name: 'client_name',
                                  label: 'Supplier Name',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Supplier Name')
                                },
                                {
                                  key: 'client_id',
                                  name: 'client_id',
                                  label: 'Supplier',
                                  type: 'multiselect-dropdown',
                                  colClass: 'col-sm-12',
                                  filters: { entity: [] },
                                  options: filtersList.client_id || [],
                                  isRequired: true,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Select Supplier')
                                },
                                {
                                  key: 'formula_description',
                                  name: 'formula_description',
                                  label: 'Formula Description',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: true,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Formula Description')
                                },
                                {
                                  key: 'formula_status',
                                  name: 'formula_status',
                                  label: 'Status',
                                  type: 'single-select',
                                  colClass: 'col-sm-12',
                                  filters: { entity: [] },
                                  options: filtersList.formula_status || [],
                                  isRequired: true,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Select Status')
                                },
                                {
                                  key: 'product_origin',
                                  name: 'product_origin',
                                  label: 'Product Origin',
                                  type: 'radio',
                                  colClass: 'col-sm-12',
                                  radio: [
                                    { value: 'D', name: 'Domestic' },
                                    { value: 'I', name: 'Imported' }
                                  ],
                                  isRequired: true,
                                  isDisabled: false
                                },
                                {
                                  key: 'product_type',
                                  name: 'product_type',
                                  label: 'Product Type',
                                  type: 'single-select',
                                  colClass: 'col-sm-12',
                                  filters: { entity: [] },
                                  options: filtersList.product_type || [],
                                  isRequired: true,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Select Product Type')
                                },
                                {
                                  key: 'classification',
                                  name: 'classification',
                                  label: 'Classification',
                                  type: 'single-select',
                                  colClass: 'col-sm-12',
                                  filters: { entity: [] },
                                  options: filtersList.classification || [],
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Select Classification')
                                },
                                {
                                  key: 'submission_id',
                                  name: 'submission_id',
                                  label: 'Submission ID',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Submission ID')
                                },
                                {
                                  key: 'formula_id',
                                  name: 'formula_id',
                                  label: 'Formula ID',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Formula ID')
                                },
                                {
                                  key: 'date_requested',
                                  name: 'date_requested',
                                  label: 'Date Requested',
                                  type: 'datepicker',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                                },
                                {
                                  key: 'commodity_statement',
                                  name: 'commodity_statement',
                                  label: 'Commodity Statement',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Commodity Statement')
                                },
                                {
                                  key: 'composition',
                                  name: 'composition',
                                  label: 'Statement of Composition',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Statement of Composition')
                                },
                                {
                                  key: 'total_batch_size',
                                  name: 'total_batch_size',
                                  label: 'Total Batch Size',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Total Batch Size')
                                },
                                {
                                  key: 'batch_size_unit_of_measure',
                                  name: 'batch_size_unit_of_measure',
                                  label: 'Batch Size Unit of Measure',
                                  type: 'radio',
                                  colClass: 'col-sm-12',
                                  radio: [
                                    { value: 'Liters', name: 'Liters' },
                                    { value: 'Gallons', name: 'Gallons' }
                                  ],
                                  isRequired: false,
                                  isDisabled: false
                                },
                                {
                                  key: 'notes',
                                  name: 'notes',
                                  label: 'Notes',
                                  type: 'text',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Enter Notes')
                                },
                                {
                                  key: 'sample_received',
                                  name: 'sample_received',
                                  label: 'Sample Received',
                                  type: 'single-select',
                                  colClass: 'col-sm-12',
                                  filters: { entity: [] },
                                  options: filtersList.sample_received || [],
                                  isRequired: true,
                                  isDisabled: false,
                                  inputSetting: this.commonService.getDropdownConfig('Select Sample Received')
                                },
                                {
                                  key: 'date_submitted',
                                  name: 'date_submitted',
                                  label: 'Date Submitted',
                                  type: 'datepicker',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                                }
                              ],
                              
                        rightSection: [
                                {
                                  key: 'lisd_doc',
                                  name: 'lisd_doc',
                                  label: 'List of Ingredients Document',
                                  type: 'attachment',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false
                                },
                                {
                                  key: 'fids_doc',
                                  name: 'fids_doc',
                                  label: 'FIDS Document',
                                  type: 'attachment',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false
                                },
                                {
                                  key: 'mm_doc',
                                  name: 'mm_doc',
                                  label: 'Method of Manufacturing Document',
                                  type: 'attachment',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false
                                },
                                {
                                  key: 'approved_doc',
                                  name: 'approved_doc',
                                  label: 'Formula Approval Document',
                                  type: 'attachment',
                                  colClass: 'col-sm-12',
                                  isRequired: false,
                                  isDisabled: false
                                },
                                {
                                  key: 'date_approved',
                                  name: 'date_approved',
                                  label: 'Date Approved',
                                  type: 'datepicker',
                                  colClass: 'col-sm-6',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                                },
                                {
                                  key: 'date_expired',
                                  name: 'date_expired',
                                  label: 'Expiration Date',
                                  type: 'datepicker',
                                  colClass: 'col-sm-6',
                                  isRequired: false,
                                  isDisabled: false,
                                  inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                                },
                                {
                                  key: 'no_expiration_date',
                                  name: 'no_expiration_date',
                                  label: 'No Expiration Date',
                                  type: 'checkbox',
                                  colClass: 'col-sm-6 float-right',
                                  isRequired: false,
                                  isDisabled: false
                                }
                              ],
                              
                        btnLabel: [
                                { type: 'Btn', label: 'Cancel', class: 'secondary w-lg' },
                                { type: 'Btn', label: 'Submit', class: 'primary w-lg' }
                        ]

                };
        }

        /**
         * Calls the API to save the formula details.
         * 
         * @param formulaData
         * @returns The response from the API.
         * @author PSI-VIII
         */
        saveFormula(formulaData) {
                return this.http
                        .post(environment.apiUrl + AppRoutes.FORMULA.SAVE, formulaData)
                        .pipe(map((response: any) => response));
        }

}
