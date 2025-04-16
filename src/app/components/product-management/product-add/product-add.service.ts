import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CommonService } from 'src/app/core/services/common.service';
import AppRoutes from 'src/app/app.routes';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class ProductAddService {

    constructor(
        private commonService: CommonService,
        private http: HttpClient
    ) { }

    /**
     * getCrudFieldConfig
     * 
     * @param crudFiltersList
     * @returns The form field configuration.
     * @author PSI-Enhancement
     */
    getCrudFieldConfig(crudFiltersList) {
        return {
            leftSection: [
                {
                    key: 'client_id',
                    name: 'client_id',
                    label: 'Supplier',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.clients || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Supplier')
                },
                {
                    key: 'brand',
                    name: 'brand',
                    label: 'Brand',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.brand || [],
                    isRequired: true,
                    isDisabled: true,
                    inputSetting: this.commonService.getDropdownConfig('Select Brand')
                },
                {
                    key: 'sub_brand_product_id',
                    name: 'sub_brand_product_id',
                    label: 'Sub-Brand Product',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.sub_brand_product_id || [],
                    isRequired: true,
                    isDisabled: true,
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Brand Product')
                },
                { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true, colClass: 'col-sm-12' },
                { type: 'text', name: 'name', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false, colClass: 'col-sm-12' },
                {
                    key: 'group',
                    name: 'group',
                    label: 'Group',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.groups || [],
                    isRequired: true,
                    isDisabled: true,
                    inputSetting: this.commonService.getDropdownConfig('Select Group')
                },
                {
                    key: 'test',
                    name: 'test',
                    label: 'Test',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: true,
                    isDisabled: true,
                    Placeholder: 'upload test',
                    isShowUploader: true
                    
                },
                {
                    key: 'aaa',
                    name: 'aaa',
                    label: 'aaa',
                    type: 'upload-attachment',
                    colClass: 'col-sm-12',
                    isRequired: true,
                    isDisabled: false,
                    Placeholder: 'upload',
                    isShowUploader: true,
                    allowedExtensions: ['pdf']
                    
                },
                {
                    key: 'producer',
                    name: 'producer',
                    label: 'Producer',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.producers || [],
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select producer')
                },
                {
                    key: 'case_unit_of_measure',
                    name: 'case_unit_of_measure',
                    label: 'Case UOM',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.cases_uom || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type')
                },
                {
                    key: 'container_type',
                    name: 'container_type',
                    label: 'Container Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.container_types || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type')
                },
                { type: 'text', name: 'ex_works_cost', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false, colClass: 'col-sm-12' },
                { type: 'checkbox', name: 'compliance', label: 'Compliance', placeholder: 'Compliance', colClass: 'col-sm-3' },
                { type: 'checkbox', name: 'use_up', label: 'Use up', placeholder: 'Use up', colClass: 'col-sm-3' },
                {
                    key: 'is_organic',
                    name: 'is_organic',
                    label: 'Organic',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.organic || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Organic')
                },
                {
                    key: 'prod_type',
                    name: 'prod_type',
                    label: 'Product Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-sm-12',
                    filters: { entity: [] },
                    options: crudFiltersList.product_type || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type')
                }
            ],
            rightSection: [
                { isHeader: true, label: 'Bottle/Unit', colClass: "u-pg-mb-1"  },
                { type: 'text', name: 'unit_length', label: 'Length', placeholder: 'Enter Length', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_width', label: 'Width', placeholder: 'Enter Width', required: false, isVisible: true, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_height', label: 'Height', placeholder: 'Enter Height', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_weight', label: 'Weight', placeholder: 'Enter Weight', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Pallet', colClass: "u-pg-my-1"  },
                { type: 'text', name: 'pallet_length', label: 'Pallet Length', placeholder: 'Enter Pallet Length', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_width', label: 'Pallet Width', placeholder: 'Enter Pallet Width', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_height', label: 'Pallet Height', placeholder: 'Enter Pallet Height', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_weight', label: 'Pallet Weight', placeholder: 'Enter Pallet Weight', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Case', colClass: "u-pg-my-1"  },
                { type: 'text', name: 'case_length', label: 'Case Length', placeholder: 'Enter Case Length', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_width', label: 'Case Width', placeholder: 'Enter Case Width', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_height', label: 'Case Height', placeholder: 'Enter Case Height', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_weight', label: 'Case Weight', placeholder: 'Enter Case Weight', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Layer', colClass: "u-pg-my-1" },
                { type: 'text', name: 'layers_per_pallet', label: 'Layers per Pallet', placeholder: 'Enter Layers per Pallet', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },
                { type: 'text', name: 'cases_per_layer', label: 'Cases per Layer', placeholder: 'Enter Cases per Layer', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },
                { type: 'text', name: 'cases_per_pallet', label: 'Cases per Pallet', placeholder: 'Enter Cases per Pallet', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },

                { isSectionHeader: true, label: 'CODES'},
                { type: 'text', name: 'product_id', label: 'Park Street Product Code', placeholder: 'Product Code', isCode: true, disabled: true, colClass: 'col-sm-12 after-section-margin' },
                { type: 'text', name: 'upc_code', label: 'UPC Code', placeholder: 'UPC Code', isCode: true, colClass: 'col-sm-12' },
                { type: 'text', name: 'scc_code', label: 'SCC Code', placeholder: 'SCC Code', isCode: true, colClass: 'col-sm-12' },
                { type: 'text', name: 'system_id', label: 'Supplier Reference ID', placeholder: 'Supplier Reference ID', isCode: true, colClass: 'col-sm-12' }

            ],
            btnLabel: [
                { type: 'Btn', label: 'Cancel', class: 'secondary w-lg' },
                { type: 'Btn', label: 'Submit', class: 'primary w-lg' }
            ]
        };
    }

    /**
     * Constructs and returns the base configuration for CRUD form fields.
     *
     * @param crudFiltersList
     * @returns Array
     * @author PSI-Enhancement
     */
    getCrudBaseFields(crudFiltersList) {
        return [
            {
                key: 'sub_type',
                name: 'sub_type',
                label: 'Sub-Type',
                type: 'multiselect-dropdown',
                colClass: 'col-xs-12',
                filters: { entity: [] },
                options: crudFiltersList.product_sub_type || [],
                isRequired: true,
                isDisabled: false,
                inputSetting: this.commonService.getDropdownConfig('Select Sub-Type')
            },
            {
                key: 'category',
                name: 'category',
                label: 'Category',
                type: 'multiselect-dropdown',
                colClass: 'col-xs-12',
                filters: { entity: [] },
                options: crudFiltersList.categories || [],
                isRequired: true,
                isDisabled: false,
                inputSetting: this.commonService.getDropdownConfig('Select Category')
            },
            {
                key: 'source',
                name: 'source',
                label: 'Source',
                type: 'multiselect-dropdown',
                colClass: 'col-xs-12',
                filters: { entity: [] },
                options: crudFiltersList.source || [],
                isRequired: true,
                isDisabled: false,
                inputSetting: this.commonService.getDropdownConfig('Select Source')
            },
            {
                key: 'country',
                name: 'country',
                label: 'Country',
                type: 'multiselect-dropdown',
                colClass: 'col-xs-12',
                filters: { entity: [] },
                options: crudFiltersList.countries || [],
                isRequired: true,
                isDisabled: false,
                inputSetting: this.commonService.getDropdownConfig('Select Country')
            },
            { type: 'text', name: 'abv', label: 'ABV %', placeholder: 'Enter ABV %', required: true, colClass: 'col-sm-12'  },
            { type: 'text', name: 'cola_ttb_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isCode: true, required: true, colClass: 'col-sm-12'  },
            { type: 'text', name: 'nabca_code', label: 'NABCA Code', placeholder: 'NABCA Code', isCode: true, colClass: 'col-sm-12'  },
            { type: 'text', name: 'unimerc_code', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isCode: true, colClass: 'col-sm-12'  },
            { type: 'text', name: 'bdn_code', label: 'BDN Code', placeholder: 'BDN Code', isCode: true, colClass: 'col-sm-12'  },
            { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address', colClass: 'col-sm-12'  },
        ];
    }

    /**
     * Constructs and returns the configuration for the form fields that are conditionally 
     * 
     * @param crudFiltersList
     * @returns object
     * @author PSI-Enhancement
     */
    getCrudConditionalFields(crudFiltersList) {
        return {
            wine: [
                {
                    key: 'vintage',
                    name: 'vintage',
                    label: 'Vintage',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.vintages || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage')
                },
                {
                    key: 'varietal',
                    name: 'varietal',
                    label: 'Varietal',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.varietals || [],
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Varietal')
                }
            ],
            malt: [
                {
                    key: 'vintage',
                    name: 'vintage',
                    label: 'Vintage',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.vintages || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage')
                }
            ],
            spirits: [
                {
                    key: 'vintage',
                    name: 'vintage',
                    label: 'Vintage',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.vintages || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage')
                }
            ],
            bulk: [
                {
                    key: 'sub_type',
                    name: 'sub_type',
                    label: 'Sub-Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.product_sub_type || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Type')
                },
                { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address' }
            ],
            other: [
                {
                    key: 'sub_type',
                    name: 'sub_type',
                    label: 'Sub-Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.product_sub_type || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Type')
                },
                { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address', colClass: 'col-sm-12'  }
            ]
        };
    }

    /**
     * Constructs and returns the configuration for the 'Sub-Type' field in the form.
     *
     * @param crudFiltersList
     * @returns
     * @author PSI-Enhancement
     */
    getSubTypeField(crudFiltersList) {
        return {
            key: 'sub_type',
            name: 'sub_type',
            label: 'Sub-Type',
            type: 'multiselect-dropdown',
            colClass: 'col-xs-12',
            filters: { entity: [] },
            options: crudFiltersList.product_sub_type || [],
            isRequired: true,
            isDisabled: false,
            inputSetting: this.commonService.getDropdownConfig('Select Sub-Type')
        };
    }

    /**
     * Returns the configuration for the 'Manufactured Location Address' text field.
     *
     * @returns The field configuration.
     * @author PSI-Enhancement
     */
    getManufacturedLocationField() {
        return {
            type: 'text',
            name: 'manufactured_location_address',
            label: 'Manufactured Location Address',
            placeholder: 'Enter Manufactured Location Address',
            colClass: 'col-sm-12' 
        }
    }

    /**
     * Calls the API to save the product details.
     * 
     * @param obj
     * @returns The response from the API.
     * @author PSI-Enhancement
     */
    getProductManagementSystemSave(obj) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.SAVE_API, obj)
            .pipe(map((response :any) => response));
    }

    getBrandSubBrandList(crudFiltersList) {
        return {
            brand: {
                key: 'brand',
                name: 'brand',
                label: 'Brand',
                type: 'multiselect-dropdown',
                isRequired: true,
                colClass: 'col-xs-12',
                inputSetting: this.commonService.getDropdownConfig('Select Brand'),
                isDisabled: false,
                display: true,
                filters: { entity: [] },
                options: crudFiltersList.brand || []
            },
            new_brands: {
                type: 'text',
                name: 'new_brands',
                label: 'New Brand',
                display: true,
                isRequired: true,
                placeholder: 'Enter Brand Name',
                colClass: 'col-sm-12'
            },
            sub_brand_product_id: {
                key: 'sub_brand_product_id',
                name: 'sub_brand_product_id',
                label: 'Sub-Brand',
                type: 'multiselect-dropdown',
                isRequired: true,
                colClass: 'col-xs-12',
                inputSetting: this.commonService.getDropdownConfig('Select Sub-Brand'),
                isDisabled: true,
                display: true,
                filters: { entity: [] },
                options: crudFiltersList.sub_brand || []
            },
            new_sub_brand: {
                type: 'text',
                name: 'new_sub_brand',
                label: 'New Sub-Brand',
                placeholder: 'Enter Sub-Brand Name',
                isRequired: true,
                display: true,
                colClass: 'col-sm-12'
            },
            net_contents: {
                key: 'net_contents',
                name: 'net_contents',
                label: 'Net Contents',
                type: 'multiselect-dropdown',
                isRequired: true,
                colClass: 'col-xs-6 nopaddingleft',
                inputSetting: this.commonService.getDropdownConfig('Select Option'),
                isDisabled: true,
                display: true,
                options: crudFiltersList.net_container_sizes || []
            },
            units_cases: {
                key: 'units_cases',
                name: 'units_cases',
                label: 'Units/Cases',
                type: 'multiselect-dropdown',
                isRequired: true,
                colClass: 'col-xs-6 nopaddingright',
                inputSetting: this.commonService.getDropdownConfig('Select Option'),
                isDisabled: true,
                display: true,
                options: crudFiltersList.units_per_case || []
            }
        };
    }

    getBrandModalData(config, istitle, isCreateButtonDisabled = true, clientID = null) {
        return {
            titleIcon: 'fas fa-info-circle',
            title: istitle ? 'Create New Brand' : 'Create New Sub Brand',
            config: config,
            client_id: clientID,
            buttons : [
                {
                    action: 'Cancel',
                    class: 'secondary',
                    isDisable: false
                }, {
                    action: 'Create',
                    class: 'primary',
                    isDisable: isCreateButtonDisabled
                }
            ]
        }
    }

     /**
     * Format the model for the product tool API.
     * @param model the model data
     * @param filtersList the filters list
     * @param subBrandProducts the sub brand products list
     * @param edit whether the form is in edit mode
     * @param duplicate whether the form is in duplicate mode
     * @param id the product id
     * @param productId the product id
     * @returns the formatted model
     * @author PSI-Enhancement
     */
     formatModelProductTool(model: any, filtersList: any, subBrandProducts: any[], edit: boolean, duplicate:boolean , id: number,productId:any): any {
        if (!Object.keys(model).length) {
            return {};  
        }
        const modelFormat = this.buildModelFormat(model, subBrandProducts, null, edit);
        
        if (model.unit_length && model.unit_width && model.unit_height && model.unit_weight) {
            modelFormat.bottle_dimensions = 
                `Length: ${model.unit_length} inches | Width: ${model.unit_width} inches | Height: ${model.unit_height} inches | Weight: ${model.unit_weight} lbs`;
        }
        if (model.case_length && model.case_width && model.case_height && model.case_weight) {
            modelFormat.case_dimensions =
                `Length: ${model.case_length} inches | Width: ${model.case_width} inches | Height: ${model.case_height} inches | Weight: ${model.case_weight} lbs`;
        }
        if (model.pallet_length && model.pallet_width && model.pallet_height && model.pallet_weight) {
            modelFormat.pallet_dimensions =
                `Length: ${model.pallet_length} inches | Width: ${model.pallet_width} inches | Height: ${model.pallet_height} inches | Weight: ${model.pallet_weight} lbs`;
        }
        if (model.bottle_dimensions == null) {
            delete modelFormat.bottle_dimensions;
        }
        if (model.case_dimensions == null) {
            delete modelFormat.case_dimensions;
        }
        if (model.pallet_dimensions == null) {
            delete modelFormat.pallet_dimensions;
        }
        if(modelFormat.prod_type){
            modelFormat.vintage =   Array.isArray(model.vintage) && model.vintage.length > 0  ? (model.vintage[0]?.id || null) 
                : model.vintage  || null,
            modelFormat.varietal =  Array.isArray(model.varietal) && model.varietal.length > 0  ? (model.varietal[0]?.id || null) 
                : model.varietal  || null,
            modelFormat.sub_type =   Array.isArray(model.sub_type) && model.sub_type.length > 0  ? (model.sub_type[0]?.id || null) 
                : model.sub_type  || null,
            modelFormat.category =  Array.isArray(model.category) && model.category.length > 0  ? (model.category[0]?.id || null) 
                : model.category  || null,
            modelFormat.source =  Array.isArray(model.source) && model.source.length > 0  ? (model.source[0]?.id || null) 
                : model.source  || null,
            modelFormat.country = Array.isArray(model.country) && model.country.length > 0  ? (model.country[0]?.id || null) 
                : model.country  || null,
            modelFormat.manufactured_location_address = model.manufactured_location_address || null,
            modelFormat.manufactured_location_address_obj = model.manufactured_location_address_obj ? model.manufactured_location_address_obj : null;
        }
        if(edit && !duplicate){
            modelFormat.id = id;
            modelFormat.temp_product_id = productId;
            modelFormat.product_id = productId;
        }
        if(duplicate){
            modelFormat.product_id = null
            modelFormat.temp_product_id = productId;  
        }

        return modelFormat;
    }

    /**
     * Build the model format for the product tool API.
     * @param model the model data
     * @param subBrandProducts the sub brand products list
     * @param result the result object
     * @param edit whether the form is in edit mode
     * @returns the formatted model
     * @author PSI-Enhancement
     */
    private buildModelFormat(model: any, subBrandProducts: any[], result: any, edit: boolean): any {
        const getSubBrandDetails = (subBrandProducts, sub_brand_product_id) => {
            const subBrand = subBrandProducts.find(product => product.name === sub_brand_product_id);
            return subBrand ? { id: subBrand.id, name: subBrand.name } : null;
        };
    
        const subBrandId = Array.isArray(model.sub_brand_product_id) ? model.sub_brand_product_id[0].name : model.sub_brand_product_id;
        const subBrandResult = getSubBrandDetails(subBrandProducts, subBrandId);
    
        return {
            compliance: model.compliance === "1" ? 1 : 0,
            use_up: model.use_up === "1" ? 1 : 0,
            is_organic: model.is_organic ? 1 : 0,
            abv: model.abv || "",
            cola_ttb_id: model.cola_ttb_id || "",
            nabca_code: model.nabca_code || "",
            bdn_code: model.bdn_code || "",
            unimerc_code: model?.unimerc_code || "",
            description: model.description || "",
            product_id: model.product_id || "",
            unit_height: edit ? model.unit_height || null : model.unit_height || "",
            unit_length: edit ? model.unit_length || null : model.unit_length || "",
            unit_width: edit ? model.unit_width || null : model.unit_width || "",
            unit_weight: edit ? model.unit_weight || null : model.unit_weight || "",
            case_width: model.case_width || "",
            case_length: model.case_length || "",
            case_height: model.case_height || "",
            case_weight: model.case_weight || "",
            pallet_length: model.pallet_length || "",
            pallet_width: model.pallet_width || "",
            pallet_height: model.pallet_height || "",
            pallet_weight: model.pallet_weight || "",
            layers_per_pallet: model.layers_per_pallet || "",
            cases_per_layer: model.cases_per_layer || "",
            cases_per_pallet: model.cases_per_pallet || "",
            system_id: model.system_id || "",
            scc_code: model.scc_code || "",
            upc_code: model.upc_code || "",
            client_id: model.client_id || "",
            sub_brand_product_name: subBrandResult ? subBrandResult.name : subBrandProducts[0]?.name || "",
            sub_brand_product_id: subBrandResult ? subBrandResult.id : subBrandProducts[0]?.id || null,
            name: model.name || "",
            group: Array.isArray(model.group) && model.group.length > 0 ? (model.group[0]?.id || null) : model.group || null,
            producer: Array.isArray(model.producer) && model.producer.length > 0 ? (model.producer[0]?.id || null) : (model.producer ? model.producer.id || model.producer : null),
            case_unit_of_measure: Array.isArray(model.case_unit_of_measure) && model.case_unit_of_measure.length > 0
                ? (model.case_unit_of_measure[0].id || null)
                : model.case_unit_of_measure || null,
            container_type: Array.isArray(model.container_type) && model.container_type.length > 0
                ? (model.container_type[0]?.id || null)
                : model.container_type || null,
            ex_works_cost: model.ex_works_cost || "",
            prod_type: Array.isArray(model.prod_type) && model.prod_type.length > 0 ? (model.prod_type[0]?.id || null) : model.prod_type || null,
            manufactured_location_address: model.manufactured_location_address || null,
            manufactured_location_address_obj: model.manufactured_location_address_obj || null
        };
    }
   

    /**
     * Retrieves the list of brands associated with the given client ID.
     * 
     * @param clientId The client ID for which to retrieve the associated brands.
     * @returns An Observable containing the data of brands.
     * @author PSI-Enhancement
     */
    getBrands(clientId: string) {
        const token = localStorage.getItem('authToken');
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }); 
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_TOOL_GET_BRANDS + `?client_id=${clientId}` , { headers })
            .pipe(map((response: any) => {return  response.data;
            })
        );
    }
 

    /**
     * Function to verify if Brand exist
     *
     * @createdDate 16-05-2022
     * @author PSI-Enhancements
     */
    getBrandExist(params) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.CHECK_BRAND_EXISTS, params)
            .pipe(map((response :any) => response));
    }

    /**
     * Function to verify if Sub-Brand exist
     * @author PSI-Enhancements
     * @param data
     */
    getSubBrandExist(params) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.CHECK_SUB_BRAND_EXISTS, params)
            .pipe(map((response :any) => response));
    }

    
    /**
     * Function to save New Brand
     * @author PSI-Enhancements
     * @param data
     */
    saveNewBrands(data) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.SAVE_NEW_BRAND, data)
            .pipe(map((response: any) => response));
    }

    /**
     * Function to save New Brand
     * @author PSI-Enhancements
     * @param data
     */
    saveNewSubBrands(data) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.SAVE_NEW_SUB_BRAND, data)
            .pipe(map((response: any) => response));
    }

    /**
     * Fetches the sub-brand products associated with the given client ID.
     * 
     * @param clientId
     * @returns An Observable containing the data of sub-brand products.
     * @author psi-enhancement
     */
    getSubBrandClients(clientId: string , brandID: string) {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams()
            .set('client_id', clientId)
            .set('brand_id', brandID);
        return this.http
            .get( environment.apiUrl + AppRoutes.PRODUCT_TOOL.GET_SUB_BRAND_WITH_CLIENT_ID , { headers, params })
            .pipe(map((response :any) => response.data));
    }

    /**
     * Configures and renders form fields based on the selected product type.
     *
     * @param selectedValue
     * @param crudFiltersList
     * @param productForm
     * @author PSI-Enhancement
     */
    renderConditionalFields(selectedValue: any, crudFiltersList, productForm , crudFieldConfig) {
        const baseFields = this.getCrudBaseFields(crudFiltersList);
        const conditionalFields = this.getCrudConditionalFields(crudFiltersList);
        const subTypeField = this.getSubTypeField(crudFiltersList);
        const manufacturedLocationField = this.getManufacturedLocationField();

        const fieldExists = (fieldName: string) => {
            const allFields = [
                ...crudFieldConfig.rightSection,
                ...crudFieldConfig.leftSection
            ];
            return allFields.some(field => field.name === fieldName);
        };

        const removeFields = (fieldsToRemove: string[]) => {
            fieldsToRemove.forEach(fieldName => {
                const allSections = [
                    crudFieldConfig.rightSection,
                    crudFieldConfig.leftSection
                ];
                allSections.forEach(section => {
                    const fieldIndex = section.findIndex(field => field.name === fieldName);
                    if (fieldIndex !== -1) {
                        section.splice(fieldIndex, 1);
                    }
                });
                const control = productForm.get(fieldName);
                if (control) {
                    control.setValue('');
                    control.clearValidators();
                    control.updateValueAndValidity();
                }
            });
        };

        const addFieldControl = (field) => {
            if (field.required || field.isRequired) {
                productForm.addControl(field.name, new FormControl('', Validators.required));
            } else {
                productForm.addControl(field.name, new FormControl(''));
            }
            const control = productForm.get(field.name);
            if (control) {
                control.markAsTouched();
            }
        };

        const addValidators = (controlName: string) => {
            const control = productForm.get(controlName);
            if (control) {
                control.setValidators([Validators.required]);
                control.updateValueAndValidity();
            }
        };

        const addCommonValidators = () => {
            ['sub_type', 'category', 'source', 'country', 'vintage'].forEach(addValidators);
        };

        switch (selectedValue) {
            case 'Wine':
                baseFields.forEach(field => {
                    if (!fieldExists(field.name)) {
                        if (field.isCode) {
                            crudFieldConfig.rightSection.push(field);
                        } else {
                            crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                        addCommonValidators();
                    }
                });
                conditionalFields.wine.forEach(field => {
                    if (!fieldExists(field.name)) {
                        crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                break;
            case 'Malt':
                baseFields.forEach(field => {
                    if (!fieldExists(field.name)) {
                        if (field.isCode) {
                            crudFieldConfig.rightSection.push(field);
                        } else {
                            crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                    }
                });
                conditionalFields.malt.forEach(field => {
                    if (!fieldExists(field.name)) {
                        crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                removeFields(['varietal']);
                break;
            case 'Spirits':
                baseFields.forEach(field => {
                    if (!fieldExists(field.name)) {
                        if (field.isCode) {
                            crudFieldConfig.rightSection.push(field);
                        } else {
                            crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                    }
                });
                conditionalFields.spirits.forEach(field => {
                    if (!fieldExists(field.name)) {
                        crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                break;
            case 'Bulk':
            case 'Other':
                if (!fieldExists('sub_type')) {
                    crudFieldConfig.leftSection.push(subTypeField);
                    addFieldControl(subTypeField);
                }
                if (!fieldExists('manufactured_location_address')) {
                    crudFieldConfig.leftSection.push(manufacturedLocationField);
                }
                addFieldControl(manufacturedLocationField);
                removeFields(['vintage', 'varietal', 'category', 'source', 'country', 'abv', 'cola_ttb_id', 'nabca_code', 'unimerc_code', 'bdn_code']);
                break;
            default:
                if (!fieldExists('manufactured_location_address')) {
                    crudFieldConfig.leftSection.push(manufacturedLocationField);
                }
                addFieldControl(manufacturedLocationField);
                break;
        }
    }

}
