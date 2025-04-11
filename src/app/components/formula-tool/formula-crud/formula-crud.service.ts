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

        let modelFormat: any = {
            id: model.id || "",
            client_name: model.client_name || "",
            client_id: model.client_id || "",
            description: model.description || "",
            formula_description: model.formula_description || "",
            formula_status: model.formula_status || "",
            product_origin: model.product_origin || "",
            product_type: model.product_type || "",
            classification: model.classification || "",
            submission_id: model.submission_id || "",
            formula_id: model.formula_id || "",
            date_requested: model.date_requested || "",
            commodity_statement: model.commodity_statement || "",
            composition: model.composition || "",
            total_batch_size: model.total_batch_size || "",
            batch_size_unit_of_measure: model.batch_size_unit_of_measure || "",
            notes: model.notes || "",
            sample_received: model.sample_received || "",
            date_submitted: model.date_submitted || "",
            lisd_doc: model.lisd_doc || "",
            fids_doc: model.fids_doc || [],
            mm_doc: model.mm_doc || [],
            approved_doc: model.approved_doc || "",
            date_approved: model.date_approved || "",
            date_expired: model.date_expired || "",
            no_expiration_date: model.no_expiration_date ? 1 : 0
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
                type: 'text', 
                name: 'id', 
                label: 'UNIQUE ID', 
                filters: { entity: [] },
                options: filtersList?.id || [],
                isDisabled: true, 
                isFieldRequired: false, 
                colClass: 'col-sm-12',
                placeholder: 'ID will be auto-generated' 
            },
            {
                key: 'client_name',
                name: 'client_name',
                label: 'Supplier Name',
                type: 'text',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Enter Supplier Name'
            },
            {
                key: 'client_id',
                name: 'client_id',
                label: 'Supplier',
                type: 'multiselect-dropdown',
                colClass: 'col-sm-12',
                filters: { entity: [] },
                options: filtersList?.client_id || [],
                isRequired: true,
                isDisabled: false,
                placeholder: 'Select Supplier',
                inputSetting: this.commonService.getDropdownConfig('Select Supplier')
            },
            { 
                type: 'text', 
                name: 'description', 
                label: 'Description', 
                placeholder: 'Enter Description', 
                required: true, 
                colClass: 'col-sm-12'
            },
            {
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
                type: 'single-select',
                colClass: 'col-sm-12',
                filters: { entity: [] },
                options: filtersList?.formula_status || [],
                isRequired: true,
                isDisabled: false,
                placeholder: 'Select Status',
                inputSetting: this.commonService.getSingleSelectDropdownConfig('Select Status', true, true)
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
                options: filtersList?.product_type || [],
                isRequired: true,
                isDisabled: false,
                placeholder: 'Select Product Type',
                inputSetting: this.commonService.getSingleSelectDropdownConfig('Select Product Type', true, true)
            },
            {
                key: 'classification',
                name: 'classification',
                label: 'Classification',
                type: 'single-select',
                colClass: 'col-sm-12',
                filters: { entity: [] },
                options: filtersList?.classification || [],
                isRequired: false,
                isDisabled: false,
                placeholder: 'Select Classification',
                inputSetting: this.commonService.getSingleSelectDropdownConfig('Select Classification', false, true)
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
                placeholder: 'Select Date',
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
                type: 'single-select',
                colClass: 'col-sm-12',
                filters: { entity: [] },
                options: filtersList?.sample_received || [],
                isRequired: true,
                isDisabled: false,
                placeholder: 'Select Sample Received',
                inputSetting: this.commonService.getSingleSelectDropdownConfig('Select Sample Received', true, true)
            },
            {
                key: 'date_submitted',
                name: 'date_submitted',
                label: 'Date Submitted',
                type: 'datepicker',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Select Date',
                inputSetting: this.commonService.dateFormat('mm/dd/yyyy')
            }
            ],

            rightSection: [
            {
                key: 'lisd_doc',
                name: 'lisd_doc',
                label: 'List of Ingredients Document',
                type: 'text',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Enter Document Name'
            },
            {
                key: 'fids_doc',
                name: 'fids_doc',
                label: 'FIDS Document',
                type: 'text',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Select Documents',
                inputSetting: this.commonService.getDropdownConfig('Select Documents')
            },
            {
                key: 'mm_doc',
                name: 'mm_doc',
                label: 'Method of Manufacturing Document',
                type: 'multiselect-dropdown',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Select Documents',
                inputSetting: this.commonService.getDropdownConfig('Select Documents')
            },
            {
                key: 'approved_doc',
                name: 'approved_doc',
                label: 'Formula Approval Document',
                type: 'attachment',
                colClass: 'col-sm-12',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Upload Document'
            },
            {
                key: 'date_approved',
                name: 'date_approved',
                label: 'Date Approved',
                type: 'datepicker',
                colClass: 'col-sm-6',
                isRequired: false,
                isDisabled: false,
                placeholder: 'Select Date',
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
                placeholder: 'Select Date',
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
            { 
                type: 'Btn', 
                label: 'Cancel', 
                class: 'secondary w-lg' 
            },
            { 
                type: 'Btn', 
                label: 'Submit', 
                class: 'primary w-lg' 
            }
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

}
