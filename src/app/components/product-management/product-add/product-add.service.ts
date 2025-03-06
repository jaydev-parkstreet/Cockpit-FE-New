import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';

@Injectable({
  providedIn: 'root'
})
export class ProductAddService {

  constructor(
    private commonService: CommonService,
    private dropdownService: InputDropdownService,
  ) { }

    getCrudFieldConfig(crudFiltersList) {
        return {
            leftSection: [
                { isHeader: true, label: 'Supplier' },
                {
                    key: 'client_id',
                    name: 'client_id',
                    label: 'Supplier',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.clients || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Supplier', true)
                },
                {
                    key: 'brand',
                    name: 'brand',
                    label: 'Brand',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.brand || [],
                    isRequired: true,
                    isDisabled: true,
                    inputSetting: this.commonService.getDropdownConfig('Select Brand', true)
                },
                {
                    key: 'sub_brand_product_id',
                    name: 'sub_brand_product_id',
                    label: 'Sub-Brand Product',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.sub_brand_product_id || [],
                    isRequired: true,
                    isDisabled: true,
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Brand Product', true)
                },
                { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true, colClass: 'col-xs-12' },
                { type: 'text', name: 'name', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false, colClass: 'col-xs-12' },
                {
                    key: 'group',
                    name: 'group',
                    label: 'Group',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.groups || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Group', true)
                },
                {
                    key: 'producer',
                    name: 'producer',
                    label: 'producer',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.producers || [],
                    isRequired: false,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select producer', true)
                },
                { isSectionHeader: true, label: '123' },
                {
                    key: 'case_unit_of_measure',
                    name: 'case_unit_of_measure',
                    label: 'Case UOM',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.cases_uom || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type', true)
                },
                {
                    key: 'container_type',
                    name: 'container_type',
                    label: 'Container Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.container_types || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type', true)
                },
                { type: 'text', name: 'ex_works_cost', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false, colClass: 'col-xs-12' },
                { type: 'checkbox', name: 'compliance', label: 'Compliance', placeholder: 'Compliance', colClass: 'col-xs-12' },
                {
                    key: 'is_organic',
                    name: 'is_organic',
                    label: 'Organic',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.organic || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Organic', true)
                },
                {
                    key: 'prod_type',
                    name: 'prod_type',
                    label: 'Product Type',
                    type: 'multiselect-dropdown',
                    colClass: 'col-xs-12',
                    filters: { entity: [] },
                    options: crudFiltersList.product_type || [],
                    isRequired: true,
                    isDisabled: false,
                    inputSetting: this.commonService.getDropdownConfig('Select Type', true)
                }
            ],
            rightSection: [
                { isHeader: true, label: 'Bottle/Unit' },
                { type: 'text', name: 'unit_length', label: 'Length', placeholder: 'Enter Length', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_width', label: 'Width', placeholder: 'Enter Width', required: false, isVisible: true, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_height', label: 'Height', placeholder: 'Enter Height', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },
                { type: 'text', name: 'unit_weight', label: 'Weight', placeholder: 'Enter Weight', required: false, isDimension: true, dimensionType: 'unit', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Pallet' },
                { type: 'text', name: 'pallet_length', label: 'Pallet Length', placeholder: 'Enter Pallet Length', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_width', label: 'Pallet Width', placeholder: 'Enter Pallet Width', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_height', label: 'Pallet Height', placeholder: 'Enter Pallet Height', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },
                { type: 'text', name: 'pallet_weight', label: 'Pallet Weight', placeholder: 'Enter Pallet Weight', required: false, isDimension: true, dimensionType: 'pallet', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Case' },
                { type: 'text', name: 'case_length', label: 'Case Length', placeholder: 'Enter Case Length', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_width', label: 'Case Width', placeholder: 'Enter Case Width', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_height', label: 'Case Height', placeholder: 'Enter Case Height', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },
                { type: 'text', name: 'case_weight', label: 'Case Weight', placeholder: 'Enter Case Weight', required: false, isDimension: true, dimensionType: 'case', colClass: 'col-sm-6' },

                { isHeader: true, label: 'Layer' },
                { type: 'text', name: 'layers_per_pallet', label: 'Layers per Pallet', placeholder: 'Enter Layers per Pallet', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },
                { type: 'text', name: 'cases_per_layer', label: 'Cases per Layer', placeholder: 'Enter Cases per Layer', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },
                { type: 'text', name: 'cases_per_pallet', label: 'Cases per Pallet', placeholder: 'Enter Cases per Pallet', required: false, isDimension: true, dimensionType: 'layer', colClass: 'col-sm-6' },

                { isSectionHeader: true, label: 'CODES' },
                { type: 'text', name: 'product_id', label: 'Park Street Product Code', placeholder: 'Product Code', isCode: true, disabled: true, colClass: 'col-sm-12' },
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
                inputSetting: this.commonService.getDropdownConfig('Select Sub-Type', true)
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
                inputSetting: this.commonService.getDropdownConfig('Select Category', true)
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
                inputSetting: this.commonService.getDropdownConfig('Select Source', true)
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
                inputSetting: this.commonService.getDropdownConfig('Select Country', true)
            },
            { type: 'text', name: 'abv', label: 'ABV %', placeholder: 'Enter ABV %', required: true },
            { type: 'text', name: 'cola_ttb_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isCode: true, required: true },
            { type: 'text', name: 'nabca_code', label: 'NABCA Code', placeholder: 'NABCA Code', isCode: true },
            { type: 'text', name: 'unimerc_code', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isCode: true },
            { type: 'text', name: 'bdn_code', label: 'BDN Code', placeholder: 'BDN Code', isCode: true },
            { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address' },
        ];
    }

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
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage', true)
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
                    inputSetting: this.commonService.getDropdownConfig('Select Varietal', true)
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
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage', true)
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
                    inputSetting: this.commonService.getDropdownConfig('Select Vintage', true)
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
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Type', true)
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
                    inputSetting: this.commonService.getDropdownConfig('Select Sub-Type', true)
                },
                { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address' }
            ]
        };
    }

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
            inputSetting: this.commonService.getDropdownConfig('Select Sub-Type', true)
        };
    }

    getManufacturedLocationField() {
        return {
            type: 'text',
            name: 'manufactured_location_address',
            label: 'Manufactured Location Address',
            placeholder: 'Enter Manufactured Location Address'
        }
    }
}
