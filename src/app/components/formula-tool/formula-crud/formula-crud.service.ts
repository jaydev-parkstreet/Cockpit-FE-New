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

        const processDropdownValue = (value) => {
            if (Array.isArray(value) && value.length > 0) {
                if (typeof value[0] === 'object' && value[0].hasOwnProperty('id')) {
                    return value[0].id;
                }
                return value.length === 1 ? value[0] : value;
            }
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
            notes: model.notes || "",
            classification: processDropdownValue(model.classification),
            submission_id: model.submission_id || "",
            formula_id: model.formula_id || "",
            date_requested: model.date_requested || null,
            commodity_statement: model.commodity_statement || "",
            commodity_statement_request: model.commodity_statement_request || "",
            total_batch_size: model.total_batch_size || "",
            batch_size_unit_of_measure: model.batch_size_unit_of_measure || "",
            sample_received: processDropdownValue(model.sample_received),
            date_submitted: model.date_submitted || null,
            formula_loi_id: model.formula_loi_id || null,
            formula_fids_id: model.formula_fids_id || null,
            formula_mom_id: model.formula_mom_id || null,
            formula_approval_id: model.formula_approval_id || null,
            date_approved: model.date_approved || null,
            date_expired: model.date_expired || null,
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
                {
                    key: 'id',
                    name: 'id',
                    label: 'UNIQUE ID',
                    type: 'text',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    disabled: true,
                    placeholder: 'Enter UNIQUE ID'
                },              
                {
                    key: 'client_id',
                    name: 'client_id',
                    label: 'Supplier Name',
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
                    placeholder: 'Enter Formula Description',
                    iconClass: 'fas fa-info-circle',
                    tooltipText: 'Please enter basic description of the Product/Formula (e.g., Grey Goose Orange Vodka).'
                },
                {
                    key: 'formula_status',
                    name: 'formula_status',
                    label: 'Status',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.formula_status || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Status')
                },
                {
                    key: 'product_origin',
                    type: 'radio',
                    name: 'product_origin',
                    label: 'Product Origin',
                    placeholder: 'Product Origin',
                    colClass: 'col-sm-12',
                    value: 'I',
                    radio: [
                        { value: 'D', name: 'Domestic' },
                        { value: 'I', name: 'Imported' }
                    ],
                    isRequired: true,
                    isProductOrigin: true,
                },
                {
                    key: 'product_type',
                    name: 'product_type',
                    label: 'Product Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList.product_type || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Product Type')
                },
                 {
                    key: 'notes',
                    name: 'notes',
                    label: 'Additional Information',
                    type: 'text',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    placeholder: 'Enter Additional Information'
                },
                {
                    key: 'classification',
                    name: 'classification',
                    label: 'Classification',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: filtersList?.classification || [],
                    isRequired: true,
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
                    key: 'commodity_statement_request',
                    name: 'commodity_statement_request',
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
                    type: 'radio',
                    name: 'batch_size_unit_of_measure',
                    label: 'Batch Size Unit of Measure',
                    placeholder: 'Batch Size Unit of Measure',
                    colClass: 'col-sm-12',
                    value: '',
                    radio: [
                        { value: 'Liters', name: 'Liters' },
                        { value: 'Gallons', name: 'Gallons' }
                    ],
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
                    key: 'date_submitted',
                    name: 'date_submitted',
                    label: 'Date Submitted',
                    type: 'datepicker',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                },
                {
                    key: 'date_approved',
                    name: 'date_approved',
                    label: 'Date Approved',
                    type: 'datepicker',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                },
                {
                    key: 'date_expired',
                    name: 'date_expired',
                    label: 'Expiration Date',
                    type: 'datepicker',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
                },
            ],

            rightSection: [
                {
                    key: 'formula_loi_id',
                    name: 'formula_loi_id',
                    label: 'List of Ingredients Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select List of ingredients Document(s)',
                    isShowUploader: true,
                    isFileUpload: true,
                    isEditMode:false,
                    isUploadMode: true,
                    allowedExtensions: ['gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'zip', 'pdf','xls', 'doc', 'docx', 'xlsx','pages', 'xlsm', 'csv', 'odt']
                },
                {
                    key: 'formula_mom_id',
                    name: 'formula_mom_id',
                    label: 'Method of Manufacturing Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select Method of Manufacturing Document(s)',
                    isShowUploader: true,
                    isFileUpload: true,
                    isEditMode:false,
                    isUploadMode: true,
                    allowedExtensions: ['gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'zip', 'pdf','xls', 'doc', 'docx', 'xlsx','pages', 'xlsm', 'csv', 'odt']
                },
                {
                    key: 'formula_fids_id',
                    name: 'formula_fids_id',
                    label: 'FIDS Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select FIDS Document(s)',
                    isShowUploader: true,
                    isFileUpload: true,
                    isEditMode:false,
                    isUploadMode: true,
                    allowedExtensions: ['gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'zip', 'pdf','xls', 'doc', 'docx', 'xlsx','pages', 'xlsm', 'csv', 'odt']
                },
                {
                    key: 'formula_approval_id',
                    name: 'formula_approval_id',
                    label: 'Formula Approval Document',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: false,
                    isDisabled: false,
                    Placeholder: 'Select Formula Approval Document(s)',
                    isShowUploader: true,
                    isFileUpload: true,
                    isEditMode:false,
                    isUploadMode: true,
                    allowedExtensions: ['gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'zip', 'pdf','xls', 'doc', 'docx', 'xlsx','pages', 'xlsm', 'csv', 'odt']
                }
            ],

            btnLabel: [
                { type: 'Btn', label: 'Cancel', class: 'secondary w-lg' },
                { type: 'Btn', label: 'Submit', class: 'primary w-lg' ,  isDisable: true}
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
