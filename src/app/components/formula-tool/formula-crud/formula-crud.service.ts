import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from 'src/app/core/services/common.service';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
     * @author PSI-VIII
     * @param model the model data
     * @param filtersList the filters list
     * @param edit whether the form is in edit mode
     * @param duplicate whether the form is in duplicate mode
     * @param id the formula id
     * @returns the formatted model
     */
    formatModelFormulaTool(model: any, filtersList: any, edit: boolean, duplicate: boolean, id: number): any {
        if (!Object.keys(model).length) {
            return {};
        }
    
        // Process dropdown fields that might be objects or arrays
        const processDropdownValue = (value) => {
            if (Array.isArray(value) && value.length > 0) {
                // If it's an array of objects with id
                if (typeof value[0] === 'object' && value[0].hasOwnProperty('id')) {
                    return value[0].id;
                }
                // If it's an array of simple values
                return value.length === 1 ? value[0] : value;
            }
            // If it's an object with id
            if (value && typeof value === 'object' && value.hasOwnProperty('id')) {
                return value.id;
            }
            return value || null;
        };
    
        let modelFormat: any = {
            formula_description: model.formula_description || "",
            id: model.id || "",
            client_name: model.client_name || "",
            client_id: processDropdownValue(model.client_id),
            formula_status: processDropdownValue(model.formula_status),
            product_origin: model.product_origin || "",
            product_type: processDropdownValue(model.product_type),
            classification: processDropdownValue(model.classification),
            submission_id: model.submission_id || "",
            formula_id: model.formula_id || "",
            date_requested: model.date_requested || null,
            commodity_statement: model.commodity_statement || "",
            composition: model.composition || "",
            total_batch_size: model.total_batch_size || "",
            batch_size_unit_of_measure: model.batch_size_unit_of_measure || "",
            notes: model.notes || "",
            sample_received: processDropdownValue(model.sample_received),
            date_submitted: model.date_submitted || null,
            lisd_doc: model.lisd_doc || null,
            fids_doc: model.fids_doc || null,
            mm_doc: model.mm_doc || null,
            approved_doc: model.approved_doc || null,
            date_approved: model.date_approved || null,
            date_expired: model.date_expired || null,
            no_expiration_date: model.no_expiration_date || false
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
     * @author PSI-VIII
     * @param filtersList
     * @returns The form field configuration.
     */
    getFormulaFieldConfig(filtersList) {
        return {
            leftSection: [
                // {
                //     key: 'id',
                //     name: 'id',
                //     label: 'UNIQUE ID',
                //     type: 'text',
                //     colClass: 'col-sm-12',
                //     isRequired: false,
                //     isDisabled: false,
                //     placeholder: 'Enter Unique ID'
                // },
                // {
                //     key: 'client_name',
                //     name: 'client_name',
                //     label: 'Supplier Name',
                //     type: 'multiselect-dropdown',
                //     colClass: 'col-sm-12',
                //     filters: { entity: [] },
                //     options: filtersList.client_name || [],
                //     isRequired: true,
                //     isDisabled: false,
                //     inputSetting: this.commonService.getDropdownConfig('Enter Supplier Name')
                // },
                {
                    key: 'client_id',
                    name: 'client_id',
                    label: 'Supplier Name',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.client_id || [],
                    isRequired: false,
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
                    placeholder: 'Enter Formula Description'
                },
                {
                    key: 'formula_status',
                    name: 'formula_status',
                    label: 'Status',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.formula_status || [],
                    isRequired: false,
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
                    isRequired: false,
                    isDisabled: false
                },
                {
                    key: 'product_type',
                    name: 'product_type',
                    label: 'Product Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.product_type || [],
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Product Type')
                },
                {
                    key: 'classification',
                    name: 'classification',
                    label: 'Classification',
                    type: 'multiselect-dropdown',
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
                    placeholder: 'Enter Submission ID'
                },
                {
                    key: 'formula_id',
                    name: 'formula_id',
                    label: 'Formula ID',
                    type: 'text',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    placeholder: 'Enter Formula ID'
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
                    placeholder: 'Enter Commodity Statement'
                },
                {
                    key: 'composition',
                    name: 'composition',
                    label: 'Statement of Composition',
                    type: 'text',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    placeholder: 'Enter Statement of Composition'
                },
                {
                    key: 'total_batch_size',
                    name: 'total_batch_size',
                    label: 'Total Batch Size',
                    type: 'text',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    placeholder: 'Enter Total Batch Size'
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
                    placeholder: 'Enter Notes'
                },
                {
                    key: 'sample_received',
                    name: 'sample_received',
                    label: 'Sample Received',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.sample_received || [],
                    isRequired: false,
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
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select List of ingredients Document(s)',
                    isShowUploader: true
                },
                {
                    key: 'fids_doc',
                    name: 'fids_doc',
                    label: 'FIDS Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select List of ingredients Document(s)',
                    isShowUploader: true
                },
                {
                    key: 'mm_doc',
                    name: 'mm_doc',
                    label: 'Method of Manufacturing Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select List of ingredients Document(s)',
                    isShowUploader: true
                },
                {
                    key: 'approved_doc',
                    name: 'approved_doc',
                    label: 'Formula Approval Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select List of ingredients Document(s)',
                    isShowUploader: true
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
                },
            ],

            btnLabel: [
                { type: 'Btn', label: 'Cancel', class: 'secondary w-lg' },
                { type: 'Btn', label: 'Submit', class: 'primary w-lg' }
            ]

        };
    }

    /**
     * Calls the API to save the formula details.
     * @author PSI-VIII
     * @param formulaData
     * @returns The response from the API.
     */
    saveFormula(formulaData) {
        return this.http
            .post(environment.apiUrl + AppRoutes.FORMULA.SAVE, formulaData)
            .pipe(map((response: any) => response));
    }

    /**
     * Calls the API to fetch the formula details.
     * @author PSI-VIII
     * @param id
     * @returns The response from the API.
     */
    saveFormulaWithAttachments(formData: FormData, edit: boolean): Observable<any> {
        const endpoint = edit ?
            `/formula/update` :
            `/formula/create`;

        return this.http.post<any>(endpoint, formData);
    }

 /**
 * Gets classification data based on product origin and type
 * @param payload Object containing product_origin and product_type
 * @returns Observable with classification data
 */
getClassification(payload: { product_origin: string, product_type: string }) {
    return this.http
      .post<any>(environment.apiUrl + AppRoutes.FORMULA.CLASSIFICATION, payload)
      .pipe(map((response: any) => response));
  }
}
