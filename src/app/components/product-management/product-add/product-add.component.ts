import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { ProductManagementService } from '../product-management.service';
import { ProductAddService } from './product-add.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { PsiBrandModalComponent } from '../psi-brand-modal/psi-brand-modal.component';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';

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
    modalData: any;
    permissions: any;
    sellectedData: any = {};
    duplicate: boolean = false;
    clientId: any;
    activeDropdownId: string | null = null;
    brand: any[] = [];
    sub_brand_product_id: any[] = [];
    sub_brand: any[] = [];
    isBrandDisabled: boolean = true;
    isSubBrandDisabled: boolean = true;
    modelFormat: any = {};
    subBrandProducts: any[] = [];
    uniqueId: any;
    productId: any;
    edit: boolean = false;
    productForm = this.formBuilder.group({});
    brandModalData: any;
    brandModalConfig: any;
    formSubmitted: boolean = false;
    isClearAllFields: boolean = false;

    headerIconConfig = {
        showIcon: true, 
        iconClass: 'fas fa-eraser'
    };

    constructor(
        private ProductAddService: ProductAddService,
        private changeDetector: ChangeDetectorRef,
        public router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private productManagementService: ProductManagementService,
        private commonService: CommonService,
        private simpleModalService: SimpleModalService
    ) { }

    ngOnInit(): void {
        this.permissions = this.route.snapshot.data['permissions'];
        this.crudFiltersList = this.route.snapshot.data['filterList'];
        this.leftTitle = 'PRODUCT DETAILS';
        this.productTitle = 'Dimensions';
        this.crudFieldConfig = this.ProductAddService.getCrudFieldConfig(this.crudFiltersList);
        this.modalData =this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');
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

        this.modelFormat = this.ProductAddService.formatModelProductTool(this.productForm.value, this.crudFiltersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId,this.productId);
    }

    /**
     * This function fetches product data based on the product id.
     * @param productId
     * @author PSI-Enhancement
     */
    async getProductData (productId) {
        this.commonService.showSpinner();
        this.productManagementService.getDetails(productId).then((response : any) => {
            this.commonService.hideSpinner();
            if (!response.hasError) {
                this.ProductAddService.renderConditionalFields(response.data.prod_type, this.crudFiltersList, this.productForm , this.crudFieldConfig);
                this.productId = response.data.product_id;
                setTimeout(() => {
                    if (this.duplicate) {
                        delete response.data.product_id;
                    }
                    if (!this.duplicate) {
                        this.uniqueId = response.data.id;
                    }
                    this.modelFormat = this.ProductAddService.formatModelProductTool(response.data, this.crudFiltersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId, this.productId);
                    this.prefillForm(response.data);
                }, 100);
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                this.router.navigate(['../']);
            }
        });
    }

    /**
     * Pre-fills the form with the product data
     * @param productData
     * @author PSI-Enhancement
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
        this.clientId = clientId.class_id;
        this.productForm.updateValueAndValidity();
    }

    /**
     * Gets an array of dropdown items from a given list that have a matching id to the given value.
     * @param list
     * @param value
     * @param name
     * @returns array
     * @author PSI-Enhancement
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
     * Function to submit Form.
     * @param form The form object.
     * @author PSI-Enhancement
     */
    onSubmit(event) {
        if (event  === "Submit") {
            this.formSubmitted = true;
            if (this.productForm.valid) {
                const formattedModel = this.ProductAddService.formatModelProductTool(
                    this.productForm.value,
                    this.crudFiltersList,
                    this.subBrandProducts,
                    this.edit,
                    this.duplicate,
                    this.uniqueId,
                    this.productId
                );
                this.commonService.showSpinner();
                this.ProductAddService.getProductManagementSystemSave(formattedModel).subscribe(response => {
                    if (!response.hasError) {
                        this.commonService.hideSpinner();
                        let productId = response.product_id;
                        if (this.edit && !this.duplicate) {
                            this.commonService.showToastV2Message(true, 'Edited Successfully!', 'fas fa-check-circle', 'success');
                        } else {
                            this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
                        }
                        this.router.navigateByUrl(`/product-management/${productId}`);
                    } else {
                        this.commonService.hideSpinner();
                        this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                    }
                });
            } else {
                this.commonService.showToastV2Message(true, "Please provide the required fields", 'fas fa-exclamation-circle');
            }
        } else {
            this.openConfirmationPopup();
        }
    }

    /**
     * Opens a confirmation popup modal asking the user if they wish to exit.
     * @author PSI-Enhancements
     */
    openConfirmationPopup() {
        const modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result.btn.label === 'Yes') {
                    this.router.navigate(["/product-management"]);
                }
            });
    }
    /**
     * This function is called when the dropdown selection changes.
     * @param fieldName
     * @param selectedValue
     * @author PSI-Enhancement
     */
    onDropdownStateChange(fieldName: any, selectedValue: any) {
        this.activeDropdownId = selectedValue ? (this.activeDropdownId === selectedValue ? null : selectedValue) : null;
        const idFields = [
            'container_type', 'client_id', 'group', 'is_organic', 'producer',
            'case_unit_of_measure', 'brand', 'varietal', 'vintage', 'sub_type',
            'category', 'source', 'country'
        ];  
        if (idFields.includes(fieldName)) {
            this.productForm.get(fieldName)?.setValue(selectedValue[0]?.id);
        } else {
            this.productForm.get(fieldName)?.setValue(selectedValue[0]?.name);
        }

        switch (fieldName) {
            case 'client_id':
                this.handleClientIdChange(selectedValue);
                break;
            case 'brand':
                this.handleBrandChange(selectedValue);
                break;
            case 'sub_brand_product_id':
                this.handleSubBrandProductIdChange(selectedValue);
                break;
            case 'prod_type':
                this.handleProdTypeChange(selectedValue);
                break;
        }
    }

    /**
     * Handles the change in client ID selection.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    private handleClientIdChange(selectedValue: any) {
        const brandControl = this.productForm.get('brand');
        const subBrandControl = this.productForm.get('sub_brand_product_id');
    
        this.clientId = selectedValue[0]?.class_id || selectedValue[0]?.client_id || null;
    
        if (selectedValue.length === 0) {
            this.updateSelectedData(['brand', 'sub_brand_product_id'], true);
        } else {
            this.isBrandDisabled = !selectedValue;
            brandControl?.setValue('');
            subBrandControl?.setValue('');
            subBrandControl?.disable();
            this.isSubBrandDisabled = true;
    
            if (brandControl) {
                brandControl.enable();
                this.getBrand(this.clientId);
            }
            this.updateSelectedData(['brand', 'sub_brand_product_id'], true);
            this.changeDetector.detectChanges();
        }
    }

    /**
     * Handles the change in brand selection.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    private handleBrandChange(selectedValue: any) {
        const subBrandControl = this.productForm.get('sub_brand_product_id');
        this.isSubBrandDisabled = !selectedValue;
        this.updateSelectedData(['sub_brand_product_id']);
        subBrandControl?.setValue('');

        if (selectedValue[0]?.isNew) {
            this.openBrandModalForNewBrand();
        } else if (!this.isSubBrandDisabled && subBrandControl) {
            subBrandControl.enable();
            this.loadSubBrandProducts(selectedValue);
        } else {
            this.sub_brand_product_id = [{ id: '', name: 'Create New', isNew: true }];
            this.updateSubBrandFilter();
            subBrandControl?.setValue('');
        }

        this.changeDetector.detectChanges();
    }

    /**
     * Loads the sub-brand products based on the selected brand.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    private loadSubBrandProducts(selectedValue: any) {
        this.productManagementService
            .getSubBrandProducts(selectedValue[0]?.client_id, selectedValue[0]?.id)
            .subscribe(subBrands => {
                this.sub_brand_product_id = [...subBrands, { id: '', name: 'Create New', isNew: true }];
                this.updateSubBrandFilter();
                this.isSubBrandDisabled = false;
            });
        this.updateSubBrandClient(selectedValue);
    }

    /**
     * Handles the change in product type selection.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    private handleProdTypeChange(selectedValue: any) {
        this.ProductAddService.renderConditionalFields(
            selectedValue[0]?.name,
            this.crudFiltersList,
            this.productForm,
            this.crudFieldConfig
        );
        this.crudFieldConfig = { ...this.crudFieldConfig };
        this.productForm = new FormGroup(this.productForm.controls);
        this.changeDetector.detectChanges();
    }

    /**
     * Handles the change in sub-brand product ID selection.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    private handleSubBrandProductIdChange(selectedValue: any) {
        if (selectedValue[0]?.isNew) {
            this.openBrandModalForNewSubBrand();
        }
        this.productForm.get('sub_brand_product_name')?.setValue(selectedValue[0]?.name || '');
    }

    /**
     * Opens the brand modal for creating a new brand.
     * @author PSI-Enhancement
     */
    private openBrandModalForNewBrand() {
        this.brandModalConfig = this.ProductAddService.getBrandSubBrandList(this.crudFiltersList);
        this.updateConfig(this.brandModalConfig.brand, false);
        this.updateConfig(this.brandModalConfig.new_brands, true);
        this.updateConfig(this.brandModalConfig.sub_brand_product_id, false);
        this.updateConfig(this.brandModalConfig.new_sub_brand, false);
        this.updateConfig(this.brandModalConfig.net_contents, false);
        this.updateConfig(this.brandModalConfig.units_cases, false);
        this.brandModalData = this.ProductAddService.getBrandModalData(this.brandModalConfig, true, this.clientId)
        this.openCreateBrandPopup(this.clientId);
    }

    /**
     * Opens the brand modal for creating a new sub-brand.
     * @author PSI-Enhancement
     */
    private openBrandModalForNewSubBrand() {
        this.brandModalConfig = this.ProductAddService.getBrandSubBrandList(this.crudFiltersList);
        this.updateConfig(this.brandModalConfig.brand, true);
        this.updateConfig(this.brandModalConfig.new_brands, false);
        this.updateConfig(this.brandModalConfig.sub_brand_product_id, true);
        this.updateConfig(this.brandModalConfig.new_sub_brand,  false);
        this.updateConfig(this.brandModalConfig.net_contents, true);
        this.updateConfig(this.brandModalConfig.units_cases, true);
        this.brandModalData = this.ProductAddService.getBrandModalData(this.brandModalConfig, false, this.clientId)
        this.openCreateBrandPopup(this.clientId);
    }

    /**
     * Fetches the brand list based on the client ID.
     * @param clientId
     * @author PSI-Enhancement
     */
    getBrand(clientId) {
        this.ProductAddService.getBrands(clientId).subscribe(brands => {
            if (Array.isArray(brands) && brands.length > 0) {
                this.brand = [...brands, { id: '', name: 'Create New', isNew: true }];
            } else {
                this.brand = [{ id: '', name: 'Create New', isNew: true }];
            }
            this.updateBrandFilter();
        });
    }
    /**
     * Updates the sub-brand product filter for the form.
     * @author PSI-Enhancement
     */
    updateSubBrandFilter() {
        if (this.sub_brand_product_id && this.sub_brand_product_id.length > 0) {
            this.crudFiltersList['sub_brand_product_id'] = this.sub_brand_product_id;
            this.subBrandProducts = this.sub_brand_product_id;
            const index = this.crudFieldConfig.leftSection.findIndex((item: any) => item.key === 'sub_brand_product_id');
            this.crudFieldConfig.leftSection[index].options = this.sub_brand_product_id;
            this.setFieldDisabled(['sub_brand_product_id'], false);
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }

    /**
     * Updates the brand filter for the form.
     * @author PSI-Enhancement
     */
    updateBrandFilter() {
        if (this.brand && this.brand.length > 0) {
            this.crudFiltersList['brand'] = this.brand;
            const index = this.crudFieldConfig.leftSection.findIndex((item: any) => item.key === 'brand');
            this.crudFieldConfig.leftSection[index].options = this.brand;
            this.setFieldDisabled(['brand'], false);
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }

    /**
     * Returns a unique identifier for each field
     * @param index
     * @param field
     * @author PSI-Enhancement
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
     * @author PSI-Enhancement
     */
    updateFormControl(controlName: string, filterKey: string, id: string) {
        const control = this.productForm.get(controlName);
        control.enable();
        this.productForm.patchValue({
            [controlName]: this.getDropDownArrayByIds(this.crudFiltersList?.[filterKey], id, controlName),
        });

        this.changeDetector.detectChanges();
    }

    /**
     * Generates a form control group based on the given crud field configuration.
     * @author PSI-Enhancement
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
     * @author PSI-Enhancement
     */
    updateBrandAndSubBrandControls(clientId: string, brandId: string, subBrandId: string) {
        this.ProductAddService.getBrands(clientId).subscribe(brands => {
            this.brand = Array.isArray(brands) && brands.length > 0 ?  [...brands, { id: '', name: 'Create New', isNew: true }] : [{ id: '', name: 'Create New', isNew: true }];
            this.updateBrandFilter();
            this.updateFormControl('brand', 'brand', brandId);

            this.productManagementService.getSubBrandProducts(clientId, brandId).subscribe(subBrands => {
                this.sub_brand_product_id = [...subBrands, { id: '', name: 'Create New', isNew: true }];
                this.updateSubBrandFilter();
                this.updateFormControl('sub_brand_product_id', 'sub_brand_product_id', subBrandId);
            });
        });
    }


    /**
     * Function to open Brand and SubBrand Popup.
     * @param clientId
     * @author PSI-Enhancement
     */
    openCreateBrandPopup(clientId) {
        this.brandModalData.client_id = clientId;
        const modalData = this.brandModalData;
        this.simpleModalService.addModal(PsiBrandModalComponent, { modalData })
            .subscribe((result) => {
                if (result?.confirm) {
                    if (result.formData.new_brands && !result.formData.net_contents) {
                        this.getBrand(clientId);
                        this.updateBrandAndSubBrandControls(clientId, result.response.data.brand[0].id, null);
                    } else {
                        this.updateBrandAndSubBrandControls(clientId ? clientId : result.formData.brand.client_id, result.response.data.brand.id, result.response.data.sub_brand_product.id);
                    }
                } else {
                    this.updateSelectedData(['brand', 'sub_brand_product_id']);
                }
            });
    }

    /**
     * Function to update config.
     * @param config
     * @param isDisplayed
     * @author PSI-Enhancement
     */
    updateConfig = (config, isDisplayed) => {
        config.display = isDisplayed;
        config.isRequired = isDisplayed;
    };

    /**
     * Function to update sub brand client.
     * @param selectedValue
     * @author PSI-Enhancement
     */
    updateSubBrandClient(selectedValue) {
        this.ProductAddService.getSubBrandClients(selectedValue[0]?.client_id, selectedValue[0]?.id).subscribe(subBrands => {
            this.sub_brand = [...subBrands, { id: '', name: 'Create New', isNew: true }];
            if (this.sub_brand && this.sub_brand.length > 0) {
                this.crudFiltersList['sub_brand'] = this.sub_brand;
                this.changeDetector.detectChanges();
            }
            this.isSubBrandDisabled = false;
        });
    }

    /**
    * Function of clear the form
    * @author PSI-Enhancements
    */
    clearAllSelections(): void {
        const modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to clear all fields?');
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData }).subscribe((result) => {
            if (result.btn.label === 'Yes') {
               this.isClearAllFields = true;
               setTimeout(() => {
                this.isClearAllFields = false;
            });
        
                const disableFields = ['brand', 'sub_brand_product_id'];
                this.crudFieldConfig.leftSection.forEach((field:any) => {
                    if (disableFields.includes(field.key)) {
                        field.isDisabled = true;
                    }
                });
                if (this.productForm) {
                    this.productForm.updateValueAndValidity();
                }
            }
        });
    } 

    /**
     * Function to empty data in model
     * @param fieldKeys
     * @param isDisabled
     * @author PSI-Enhancements
     */
    updateSelectedData(fields: string[], disableFields: boolean = false) {
        fields.forEach(field => this.sellectedData[field] = []);
        if (disableFields) this.setFieldDisabled(fields, true);
    }

    /**
     * Function to set field disabled
     * @param fieldKeys
     * @param isDisabled
     * @author PSI-Enhancements
     */
    setFieldDisabled(fieldKeys, isDisabled) {
        fieldKeys.forEach(key => {
            const field = this.crudFieldConfig.leftSection.find(element => element.key === key);
            if (field) field.isDisabled = isDisabled;
        });
    }

}
