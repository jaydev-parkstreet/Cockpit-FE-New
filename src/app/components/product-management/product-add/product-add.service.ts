import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductAddService {

  constructor(private commonService: CommonService) { }

  getCrudFieldConfig(crudFiltersList) {
    return {
      productSection: [
        {
          key: 'client_id',
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
          label: 'Brand',
          type: 'multiselect-dropdown',
          colClass: 'col-xs-12',
          filters: { entity: [] },
          options: crudFiltersList.brand || [],
          isRequired: true,
          isDisabled: false,
          inputSetting: this.commonService.getDropdownConfig('Select Brand', true)
        },
        {
          key: 'sub_brand_product_id',
          label: 'Sub-Brand Product',
          type: 'multiselect-dropdown',
          colClass: 'col-xs-12',
          filters: { entity: [] },
          options: crudFiltersList.sub_brand_product_id || [],
          isRequired: true,
          isDisabled: false,
          inputSetting: this.commonService.getDropdownConfig('Select Sub-Brand Product', true)
        },
        { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true },
        { type: 'text', name: 'name', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false },
        {
          key: 'group',
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
          label: 'producer',
          type: 'multiselect-dropdown',
          colClass: 'col-xs-12',
          filters: { entity: [] },
          options: crudFiltersList.producers || [],
          isRequired: true,
          isDisabled: false,
          inputSetting: this.commonService.getDropdownConfig('Select producer', true)
        },
        {
          key: 'case_unit_of_measure',
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
          label: 'Container Type',
          type: 'multiselect-dropdown',
          colClass: 'col-xs-12',
          filters: { entity: [] },
          options: crudFiltersList.container_types || [],
          isRequired: true,
          isDisabled: false,
          inputSetting: this.commonService.getDropdownConfig('Select Type', true)
        },
        { type: 'text', name: 'ex_works_cost', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false },
        { type: 'checkbox', name: 'compliance', label: 'Compliance', placeholder: 'Compliance' },
        {
          key: 'is_organic',
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
  
      codeSection: [
        { type: 'text', name: 'product_id', label: 'Park Street Product Code', placeholder: 'Product Code', isCode: true, disabled: true },
        { type: 'text', name: 'upc_code', label: 'UPC Code', placeholder: 'UPC Code', isCode: true },
        { type: 'text', name: 'scc_code', label: 'SCC Code', placeholder: 'SCC Code', isCode: true },
        { type: 'text', name: 'system_id', label: 'Supplier Reference ID', placeholder: 'Supplier Reference ID', isCode: true }
      ],
  
      dimensionsSection: [
        { type: 'text', name: 'unit_length', label: 'Length', placeholder: 'Enter Length', required: false, isDimension: true, dimensionType: 'unit' },
        { type: 'text', name: 'unit_width', label: 'Width', placeholder: 'Enter Width', required: false, isVisible: true, isDimension: true, dimensionType: 'unit' },
        { type: 'text', name: 'unit_height', label: 'Height', placeholder: 'Enter Height', required: false, isDimension: true, dimensionType: 'unit' },
        { type: 'text', name: 'unit_weight', label: 'Weight', placeholder: 'Enter Weight', required: false, isDimension: true, dimensionType: 'unit' },
        { type: 'text', name: 'pallet_length', label: 'Pallet Length', placeholder: 'Enter Pallet Length', required: false, isDimension: true, dimensionType: 'pallet' },
        { type: 'text', name: 'pallet_width', label: 'Pallet Width', placeholder: 'Enter Pallet Width', required: false, isDimension: true, dimensionType: 'pallet' },
        { type: 'text', name: 'pallet_height', label: 'Pallet Height', placeholder: 'Enter Pallet Height', required: false, isDimension: true, dimensionType: 'pallet' },
        { type: 'text', name: 'pallet_weight', label: 'Pallet Weight', placeholder: 'Enter Pallet Weight', required: false, isDimension: true, dimensionType: 'pallet' },
        { type: 'text', name: 'layers_per_pallet', label: 'Layers per Pallet', placeholder: 'Enter Layers per Pallet', required: false, isDimension: true, dimensionType: 'layer' },
        { type: 'text', name: 'cases_per_layer', label: 'Cases per Layer', placeholder: 'Enter Cases per Layer', required: false, isDimension: true, dimensionType: 'layer' },
        { type: 'text', name: 'cases_per_pallet', label: 'Cases per Pallet', placeholder: 'Enter Cases per Pallet', required: false, isDimension: true, dimensionType: 'layer' },
      ]
    };
  }
}
