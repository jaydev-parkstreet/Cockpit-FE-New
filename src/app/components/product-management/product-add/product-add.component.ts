import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { ProductManagementService } from '../product-management.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductAddService } from './product-add.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
    @Output() updateFilters = new EventEmitter<any>();

    leftTitle: string;
    productTitle: string;
    rightHeaderBottomTitle: string;
    crudFieldConfig: any;
    crudFiltersList: any;
    permissions: any;
    sellectedData: any = {};
    duplicate: boolean = false;
    clientId: any;
    activeDropdownId: string | null = null;
    brand: any[] = [];
    sub_brand_product_id: any[] = [];
    isBrandDisabled: boolean = true;
    isSubBrandDisabled: boolean = true;
    modelFormat: any = {}; 
    subBrandProducts: any[] = []; 
    uniqueId: any;
    productId: any;
    edit: boolean = false;
    productForm = this.formBuilder.group({});

    constructor(
        private ProductAddService: ProductAddService,
        private changeDetector: ChangeDetectorRef,
        public router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private productmanagementService: ProductManagementService,
        private spinner : NgxSpinnerService,
        private commonService: CommonService
    ) { }

    ngOnInit(): void {
        this.permissions = this.route.snapshot.data['permissions'];
        this.crudFiltersList = this.route.snapshot.data['filterList'];
        this.leftTitle = 'PRODUCT DETAILS';
        this.productTitle = 'Dimensions';
        this.crudFieldConfig = this.ProductAddService.getCrudFieldConfig(this.crudFiltersList);
        if (!this.permissions.permissions.Create) {
            this.router.navigate(['product-management']);
        }
        let productId = this.route.snapshot.paramMap.get('id');
        this.duplicate = this.route.snapshot.data.isDuplicate || false;
        if (productId) {
            this.edit = true;
        }
        else {
            this.edit = false;
        }
        if (productId) {
            this.getProductData(productId);
        }

        this.getFormControl();
        this.modelFormat = this.productmanagementService.formatModelProductTool(this.productForm.value, this.crudFiltersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId,this.productId);
    }

    /**
     * This function fetches product data based on the product id.
     * @param productId
     * @author psi-enhancement
     */
    async getProductData (productId) {
        this.productmanagementService.getDetails(productId).subscribe((productData) => {
            this.renderConditionalFields(productData.prod_type, this.crudFiltersList, this.productForm);
            this.productId = productData.product_id;
            setTimeout(() => {
                if (this.duplicate) {
                    delete productData.product_id;
                }
                if (!this.duplicate) {
                    this.uniqueId = productData.id;
                }
                this.modelFormat = this.productmanagementService.formatModelProductTool(productData, this.crudFiltersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId, this.productId);
                this.prefillForm(productData);
            }, 100);
        });
    }

    /**
     * Pre-fills the form with the product data
     * @param productData
     * @author psi-enhancement
     */
    prefillForm(productData: any): void {
        this.productForm.patchValue({
            client_id: this.getDropDownArrayByIds(this.crudFiltersList?.clients, productData.client_id, 'client_id'),
            description: productData.description,
            name: productData.fanciful_name,
            group: this.getDropDownArrayByIds(this.crudFiltersList?.groups, productData.group_id, 'group'),
            producer: this.getDropDownArrayByIds(this.crudFiltersList?.producers, productData.producer_id, 'producer'),
            case_unit_of_measure: this.getDropDownArrayByIds(this.crudFiltersList?.cases_uom, productData.case_unit_of_measure, 'case_unit_of_measure'),
            container_type: this.getDropDownArrayByIds(this.crudFiltersList?.container_types, productData.container_type, 'container_type'),
            ex_works_cost: productData.ex_works_cost,
            is_organic: this.getDropDownArrayByIds(this.crudFiltersList?.organic, productData.is_organic, 'is_organic'),
            prod_type: this.getDropDownArrayByIds(this.crudFiltersList?.product_type, productData.prod_type, 'prod_type'),
            sub_type: this.getDropDownArrayByIds(this.crudFiltersList?.product_sub_type, productData.sub_type, 'sub_type'),
            category: this.getDropDownArrayByIds(this.crudFiltersList?.categories, productData.category_id, 'category'),
            source: this.getDropDownArrayByIds(this.crudFiltersList?.source, productData.source, 'source'),
            country: this.getDropDownArrayByIds(this.crudFiltersList?.countries, productData.country_id, 'country'),
            vintage: this.getDropDownArrayByIds(this.crudFiltersList?.vintages, productData.vintage, 'vintage'),
            varietal: this.getDropDownArrayByIds(this.crudFiltersList?.varietals, productData.varietal_id, 'varietal'),
            product_id: productData.product_id ? productData.product_id : '',
            compliance: productData.compliance === 1  ? "1" : "0",
            use_up: productData.use_up === 1  ? "1" : "0",
            abv: productData.abv,
            manufactured_location_address: productData?.manufactured_location_address,
            upc_code: productData.upc_code,
            scc_code: productData.scc_code,
            system_id: productData.supplier_ref_id,
            cola_ttb_id: productData.cola_ttb_id,
            nabca_code: productData.nabca_code,
            unimerc_code: productData?.unimerc_code,
            bdn_code: productData.bdn_code,
            unit_length: productData.unit_length,
            unit_width: productData.unit_width,
            unit_height: productData.unit_height,
            unit_weight: productData?.unit_weight,
            pallet_length: productData?.pallet_length,
            pallet_width: productData?.pallet_width,
            pallet_height: productData?.pallet_height,
            pallet_weight: productData?.pallet_weight,
            case_length: productData?.case_length,
            case_width: productData?.case_width,
            case_height: productData?.case_height,
            case_weight: productData?.case_weight,
            layers_per_pallet: productData.layers_per_pallet,
            cases_per_layer: productData.cases_per_layer,
            cases_per_pallet: productData.cases_per_pallet,
        });
        let clientId = this.productForm.value.client_id[0];
        this.updateBrandAndSubBrandControls(clientId.class_id, productData.brand_id, productData.sub_brand_product_id);
        this.productForm.get("client_id").setValue(clientId.id);
        this.productForm.updateValueAndValidity();
    }

    /**
     * Gets an array of dropdown items from a given list that have a matching id to the given value.
     * @param list
     * @param value
     * @param name
     * @returns array
     * @author psi-enhancement
     */
    getDropDownArrayByIds(list, value, name) {
        let result = [];
        for (let i = 0; i < list?.length; i++) {
            if (list[i].id == value) {
                result.push(list[i]);
                this.sellectedData[name] = result
                return result;
            }

        }
        return result.length === 0 ? null : result;
    }

    /**
     * Called when the form is submitted.
     * @param form The form object.
     * @author psi-enhancement
     */
    onSubmit(form: FormGroup) {
        if (form.valid) {
            const formattedModel = this.productmanagementService.formatModelProductTool(
                form.value,
                this.crudFiltersList,
                this.subBrandProducts,
                this.edit,
                this.duplicate,
                this.uniqueId,
                this.productId
            );
            this.spinner.show()
            this.ProductAddService.getProductManagementSystemSave(formattedModel).subscribe(response => {
                if (!response.hasError) {
                    this.spinner.hide();
                    let productId = response.product_id;
                    if (this.edit) {
                        this.commonService.showToastV2Message(true, 'Edited Successfully!', 'fas fa-exclamation-circle');
                        this.router.navigateByUrl(`/product-management/${productId}`);
                    } else {
                        this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle');
                        this.router.navigateByUrl(`/product-management/${productId}`);
                    }
                } else {
                    this.spinner.hide();
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                }
            });
        } else {
            this.commonService.showToastV2Message(true, "Please provide The required Fields", 'fas fa-exclamation-circle');
        }
    }

    /**
     * This function is called when the dropdown selection changes.
     * @param fieldName
     * @param selectedValue
     * @author psi-enhancement
     */
    onDropdownStateChange(fieldName: any, selectedValue: any) {
        this.activeDropdownId = selectedValue ? (this.activeDropdownId === selectedValue ? null : selectedValue) : null;
        if (fieldName == 'container_type' || fieldName == "client_id" || fieldName == "group"
            || fieldName == "is_organic" || fieldName == "producer" || fieldName == "case_unit_of_measure" || fieldName == "brand"
            || fieldName == "varietal" || fieldName == "vintage" || fieldName == "sub_type" || fieldName == "category" || fieldName == "source"
            || fieldName == "country") {
            this.productForm.get(fieldName)?.setValue(selectedValue[0].id);
        }
        else {
            this.productForm.get(fieldName)?.setValue(selectedValue[0].name);
        }

        const brandControl = this.productForm.get('brand');
        const subBrandControl = this.productForm.get('sub_brand_product_id');
        this.clientId = selectedValue[0]?.class_id;

        if (fieldName === 'client_id' && selectedValue.length > 0) {
            this.isBrandDisabled = !selectedValue;
            brandControl.setValue('');
            subBrandControl.setValue('');
            subBrandControl.disable();
            this.updatesellectedData('brand', 'Select Brand');
            this.updatesellectedData('sub_brand_product_id', 'Select Sub-Brand Product');
            this.isSubBrandDisabled = true;
            if (selectedValue && brandControl) {
                brandControl.enable();
                this.productmanagementService.getBrands(this.clientId).subscribe(brands => {
                    if (Array.isArray(brands) && brands.length > 0) {
                        this.brand = brands;
                        this.updateBrandFilter();
                    } else {
                        this.brand = [];
                        this.updateBrandFilter();
                    }
                });
            }
            this.changeDetector.detectChanges();
        }

        if (fieldName === 'brand') {
            this.isSubBrandDisabled = !selectedValue;
            this.updatesellectedData('sub_brand_product_id', 'Select Sub-Brand Product');
            subBrandControl.setValue('');
            if (!this.isSubBrandDisabled && subBrandControl) {
                subBrandControl.enable();
                this.productmanagementService.getSubBrandProducts(selectedValue[0]?.client_id).subscribe(subBrands => {
                    this.sub_brand_product_id = subBrands;
                    this.updateSubBrandFilter();
                    this.isSubBrandDisabled = false;
                });
            } else {
                this.sub_brand_product_id = [];
                this.updateSubBrandFilter();
                subBrandControl.setValue('');
            }
            this.changeDetector.detectChanges();
        }

        if (fieldName == 'sub_brand_product_id') {
            this.productForm.get('sub_brand_product_name')?.setValue(selectedValue[0].name);
        }
        if (fieldName === 'prod_type') {
            this.renderConditionalFields(selectedValue[0].name, this.crudFiltersList, this.productForm);
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.productForm = new FormGroup(this.productForm.controls);
            this.changeDetector.detectChanges();
        }
    }
    /**
     * Updates the sub-brand product filter for the form.
     * @author psi-enhancement
     */
    updateSubBrandFilter() {
        if (this.sub_brand_product_id && this.sub_brand_product_id.length > 0) {
            this.crudFiltersList['sub_brand_product_id'] = this.sub_brand_product_id;
            this.subBrandProducts = this.sub_brand_product_id;
            this.crudFieldConfig.leftSection[2].options = this.sub_brand_product_id;
            this.crudFieldConfig.leftSection[2].isDisabled = false
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }

    /**
     * Updates the brand filter for the form.
     * @author psi-enhancement
     */
    updateBrandFilter() {
        if (this.brand && this.brand.length > 0) {
            this.crudFiltersList['brand'] = this.brand;
            this.crudFieldConfig.leftSection[1].options = this.brand
            this.crudFieldConfig.leftSection[1].isDisabled = false
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }
    
    /**
     * Returns a unique identifier for each field
     * @param index
     * @param field
     * @author psi-enhancement
     * @returns A unique string identifier
     */
    trackByField(index: number, field: any): string {
        return field.name;
    }
  
    /**
     * Enable the form control and update its value based on the given id and filter key
     * @param controlName
     * @param filterKey
     * @param id
     * @author psi-enhancement
     */
    updateFormControl(controlName: string, filterKey: string, id: string) {
        const control = this.productForm.get(controlName);
        control.enable();
        this.productForm.patchValue({
            [controlName]: this.getDropDownArrayByIds(this.crudFiltersList?.[filterKey], id, controlName),
        });
    }

    /**
     * Generates a form control group based on the given crud field configuration.
     * @author psi-enhancement
     */
    getFormControl() {
        const controls = {};
        const allFields = [
            ...this.crudFieldConfig.rightSection,
            ...this.crudFieldConfig.leftSection
        ];
        allFields.forEach(field => {
            const isDisabled = field.isDisabled || false;
            const isFieldRequired = field.required || field.isRequired;
            const formControl = new FormControl(
                { value: '', disabled: isDisabled },
                isFieldRequired ? Validators.required : []
            );
            
            controls[field.name] = formControl;
        });
        this.productForm = new FormGroup(controls);
    }

    /**
     * Updates the brand and sub-brand controls of the form.
     * @param clientId
     * @param brandId
     * @param subBrandId
     * @author psi-enhancement
     */
    updateBrandAndSubBrandControls(clientId: string, brandId: string, subBrandId: string) {
        this.productmanagementService.getBrands(clientId).subscribe(brands => {
            this.brand = Array.isArray(brands) && brands.length > 0 ? brands : [];
            this.updateBrandFilter();
            this.updateFormControl('brand', 'brand', brandId);

            this.productmanagementService.getSubBrandProducts(clientId).subscribe(subBrands => {
                this.sub_brand_product_id = subBrands;
                this.updateSubBrandFilter();
                this.updateFormControl('sub_brand_product_id', 'sub_brand_product_id', subBrandId);
            });
        });
    }

    /**
     * Updates the sellectedData object to include a default value for the given key.
     * @param key
     * @param defaultText
     * @author psi-enhancement
     */
    updatesellectedData(key: string, defaultText: string) {
        this.sellectedData[key] = [{ name: defaultText }];
    }

    /**
     * Configures and renders form fields based on the selected product type.
     *
     * @param selectedValue
     * @param crudFiltersList
     * @param productForm
     * @author psi-enhancement
     */
    renderConditionalFields(selectedValue: any, crudFiltersList, productForm) {
        const baseFields = this.ProductAddService.getCrudBaseFields(crudFiltersList);
        const conditionalFields = this.ProductAddService.getCrudConditionalFields(crudFiltersList);
        const subTypeField = this.ProductAddService.getSubTypeField(crudFiltersList);
        const manufacturedLocationField = this.ProductAddService.getManufacturedLocationField();

        const fieldExists = (fieldName: string) => {
            const allFields = [
                ...this.crudFieldConfig.rightSection,
                ...this.crudFieldConfig.leftSection
            ];
            return allFields.some(field => field.name === fieldName);
        };

        const removeFields = (fieldsToRemove: string[]) => {
            fieldsToRemove.forEach(fieldName => {
                const allSections = [
                    this.crudFieldConfig.rightSection,
                    this.crudFieldConfig.leftSection
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
            if (field.required) {
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
                control.updateValueAndValidity(); // Re-validate the control
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
                            this.crudFieldConfig.rightSection.push(field);
                        } else {
                            this.crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                        addCommonValidators();
                    }
                });
                conditionalFields.wine.forEach(field => {
                    if (!fieldExists(field.name)) {
                        this.crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                break;
            case 'Malt':
                baseFields.forEach(field => {
                    if (!fieldExists(field.name)) {
                        if (field.isCode) {
                            this.crudFieldConfig.rightSection.push(field);
                        } else {
                            this.crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                    }
                });
                conditionalFields.malt.forEach(field => {
                    if (!fieldExists(field.name)) {
                        this.crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                removeFields(['varietal']);
                break;
            case 'Spirits':
                baseFields.forEach(field => {
                    if (!fieldExists(field.name)) {
                        if (field.isCode) {
                            this.crudFieldConfig.rightSection.push(field);
                        } else {
                            this.crudFieldConfig.leftSection.push(field);
                        }
                        addFieldControl(field);
                    }
                });
                conditionalFields.spirits.forEach(field => {
                    if (!fieldExists(field.name)) {
                        this.crudFieldConfig.leftSection.push(field);
                        addFieldControl(field);
                    }
                });
                break;
            case 'Bulk':
            case 'Other':
                if (!fieldExists('sub_type')) {
                    this.crudFieldConfig.leftSection.push(subTypeField);
                    addFieldControl(subTypeField);
                }
                if (!fieldExists('manufactured_location_address')) {
                    this.crudFieldConfig.leftSection.push(manufacturedLocationField);
                }
                addFieldControl(manufacturedLocationField);
                removeFields(['vintage', 'varietal', 'category', 'source', 'country', 'abv', 'cola_ttb_id', 'nabca_code', 'unimerc_code', 'bdn_code']);
                break;
            default:
                if (!fieldExists('manufactured_location_address')) {
                    this.crudFieldConfig.leftSection.push(manufacturedLocationField);
                }
                addFieldControl(manufacturedLocationField);
                break;
        }
    }
}
