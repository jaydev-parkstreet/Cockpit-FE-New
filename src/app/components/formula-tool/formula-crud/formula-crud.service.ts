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
         */
        getFormulaFieldConfig(filtersList) {
                return {
                        leftSection: [
                                {
                                        key: 'name',
                                        name: 'name',
                                        label: 'Formula Name',
                                        type: 'text',
                                        colClass: 'col-sm-12',
                                        placeholder: 'Enter Formula Name',
                                        isRequired: true,
                                        isDisabled: false
                                },
                                {
                                        key: 'client_id',
                                        name: 'name',
                                        label: 'client ID',
                                        type: 'text',
                                        colClass: 'col-sm-12',
                                        placeholder: 'Enter Formula Name',
                                        isRequired: true,
                                        isDisabled: false
                                },
                        
                                // {
                                //         key: 'quantity',
                                //         name: 'quantity',
                                //         label: 'Quantity',
                                //         type: 'text',
                                //         colClass: 'col-sm-12',
                                //         placeholder: 'Enter Quantity',
                                //         isRequired: true,
                                //         isDisabled: false
                                // },
                                // {
                                //         key: 'unit',
                                //         name: 'unit',
                                //         label: 'Unit',
                                //         type: 'multiselect-dropdown',
                                //         colClass: 'col-sm-12',
                                //         filters: { entity: [] },
                                //         options: filtersList.units || [],
                                //         isRequired: true,
                                //         isDisabled: false,
                                //         inputSetting: this.commonService.getDropdownConfig('Select Unit')
                                // }
                        ],
                        rightSection: [
                                {
                                        key: 'description',
                                        name: 'description',
                                        label: 'Description',
                                        type: 'textarea',
                                        colClass: 'col-sm-12',
                                        placeholder: 'Enter Description',
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
         */
        saveFormula(formulaData) {
                return this.http
                        .post(environment.apiUrl + AppRoutes.FORMULA.SAVE, formulaData)
                        .pipe(map((response: any) => response));
        }

        /**
         * Fetches the list of ingredients for the formula.
         * 
         * @returns An Observable containing the list of ingredients.
         */
        // getIngredients() {
        //         const token = localStorage.getItem('authToken');
        //         const headers = new HttpHeaders({
        //                 'Authorization': `Bearer ${token}`,
        //                 'Content-Type': 'application/json'
        //         });
        //         return this.http
        //                 .get(environment.apiUrl + AppRoutes.FORMULA.GET_INGREDIENTS, { headers })
        //                 .pipe(map((response: any) => response.data));
        // }

}
