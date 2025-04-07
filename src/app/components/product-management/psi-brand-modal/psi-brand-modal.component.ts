import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { ProductAddService } from '../product-add/product-add.service';
import { CommonService } from 'src/app/core/services/common.service';

export interface BrandModal {
    modalData: any;
}

@Component({
    selector: 'app-psi-brand-modal',
    templateUrl: './psi-brand-modal.component.html',
    styleUrls: ['./psi-brand-modal.component.scss']
})
export class PsiBrandModalComponent extends SimpleModalComponent<BrandModal, any> implements BrandModal, OnInit {
    @Input() modalData: any;
    formSubmitted: boolean;
    sellectedData: any = {};
    isCreateButtonDisabled: boolean = false;

    constructor(
        private simpleModalService: SimpleModalService,
        private formBuilder: FormBuilder,
        private ProductAddService: ProductAddService,
        private changeDetector: ChangeDetectorRef,
        private commonService: CommonService,
    ) {
        super();
    }
    brandForm = this.formBuilder.group({});
    ngOnInit(): void {
        this.formSubmitted = false;
        this.getFormControl();
    }

    /**
     * Function to get form control fields.
     * @author PSI-Enhancements
     */
    getFormControl() {
        const controls = {};
        Object.keys(this.modalData.config).forEach(key => {
            const field = this.modalData.config[key];
            const isFieldRequired = field.required || field.isRequired;
            const formControl = new FormControl(
                '',
                isFieldRequired ? Validators.required : []
            );

            controls[field.name] = formControl;
        });
        this.brandForm = new FormGroup(controls);
    }

    /**
     * Function to close popup.
     * @author PSI-Enhancements
     */
    cancel(): void {
        this.close();
    }

    /**
     * Function for button click event.
     * @author PSI-Enhancements
     * @param event
     */
    onButtonClicked(event) {
        if (event === "Cancel") {
            this.result = { confirm: false };
            this.close();
        }
        if (event === "Create") {
            this.formSubmitted = true;
            if (!this.brandForm.invalid) {
                this.result = { confirm: true, formData: this.brandForm.value };
                if (this.result.formData.new_brands && !this.result.formData.net_contents) {
                    const param = {
                        client_id: this.modalData.client_id,
                        brand_id: '',
                        brand_name: this.result.formData.new_brands
                    };
                    this.commonService.showSpinner();
                    this.ProductAddService.saveNewBrands(param).subscribe(response => {
                        this.commonService.hideSpinner();
                        if (!response.hasError) {
                            this.result = { confirm: true, formData: this.brandForm.value, response: response };
                            this.close();
                        } else {
                            this.modalData.config.hasError = response.hasError;
                            this.modalData.config.validationMessage = response.msg;
                            this.changeDetector.detectChanges();
                        }
                    });
                } else {
                    const param = {
                        client_id: this.modalData.client_id ? this.modalData.client_id : this.result.formData.brand.client_id,
                        brand_id: this.result.formData.brand.id,
                        brand_name: this.result.formData.new_brands,
                        sub_brand_id: this.result.formData.sub_brand_product_id.id || '',
                        sub_brand_name: this.result.formData.new_sub_brand,
                        net_content_id: this.result.formData.net_contents.id,
                        bpc_id: this.result.formData.units_cases.id
                    };
                    this.commonService.showSpinner();
                    this.ProductAddService.saveNewSubBrands(param).subscribe(response => {
                        this.commonService.hideSpinner();
                        if (!response.hasError) {
                            this.result = { confirm: true, formData: this.brandForm.value, response: response };
                            this.close();
                        }
                        else {
                            this.modalData.config.net_contents.hasError = response.hasError;
                            this.modalData.config.net_contents.validationMessage = 'Net Contents already exists';
                            this.modalData.config.units_cases.hasError = response.hasError;
                            this.modalData.config.units_cases.validationMessage = 'Units/Case already exists';
                            this.isCreateButtonDisabled = true;
                            this.changeDetector.detectChanges();
                        }
                    });
                }

            }
        }
    }


    /**
    * Function to get config array.
    * @author PSI-Enhancements
    * @param config
    */
    getConfigArray(config) {
        return Object.keys(config).map(key => config[key]);
    }

    /**
     * Updates the value of a dropdown form control.
     * @param field
     * @param event
     * @author PSI-Enhancements
     */
    onDropdownStateChange(field, event) {
        this.brandForm.get(field)?.setValue(event[0]);
        this.updateFilter({ field, event });
        if (event[0]?.client_id && event[0]?.id) {
            this.updateSubBrandClient(event)
        }
        this.changeDetector.detectChanges();
    }

    /**
     * Updates the form control value based on the input change.
     * @param field
     * @param value
     * @author PSI-Enhancements
     */
    onInputChange(field, value) {
        this.brandForm.get(field).setValue(value);
        let form = this.brandForm.value;
        let clientId = this.modalData.client_id;
        this.CheckBrandValueExist({ field, value, form }, clientId);
       
        this.changeDetector.detectChanges();
    }

    /**
      * Returns true if the field is invalid and the form has been submitted.
      * @param controlName
      * @returns boolean
      * @author PSI-Enhancements
      */
    isFieldInvalid(controlName: string): boolean {
        const control = this.brandForm.get(controlName);
        const field = this.modalData.config[controlName];
        return (control?.invalid || field?.hasError) && this.isCreateButtonDisabled;
    }


    /**
      * Function to update config.
      * @param config
      * @param isDisplayed
      * @author PSI-Enhancements
      */
    updateConfig = (config, isDisplayed) => {
        config.display = isDisplayed;
        config.isRequired = isDisplayed;
    };


    /**
      * Function to check brand and sub-brand is already exists or not.
      * @param data
      * @param clientId
      * @author PSI-Enhancements
      */
    CheckBrandValueExist(data, clientId) {
        if (data.field === 'new_brands') {
            const param = {
                client_id: clientId,
                name: data.value
            };
            this.checkBrandExist(data,param);
        }

        if (data.field === 'new_sub_brand') {
            const param = {
                brand_id: data.form.brand.id,
                client_id: clientId,
                name: data.value
            };
            this.checkSubBrandExits(data, param);

        }
    }


    /**
      * Function to check brand is already exists or not.
      * @param data
      * @param param
      * @author PSI-Enhancements
      */
    checkBrandExist(data, param) {
        this.ProductAddService.getBrandExist(param).subscribe(response => {
            this.modalData.config.new_brands.hasError = response.hasError;
            this.modalData.config.new_brands.validationMessage = response.msg;
            if (response.msg === 'Brand name already exists' || data.value === '') {
               this.isDisableCheckCreateBrand(this.isCreateButtonDisabled = true, true);
               this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, true, true, this.modalData.client_id);
            } else {
                this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, true, false, this.modalData.client_id);
            }
            this.changeDetector.detectChanges();
        });
    }

    /**
      * Function to check Sub-brand is already exists or not.
      * @param data
      * @param param
      * @author PSI-Enhancements
      */
    checkSubBrandExits(data, param) {
        this.ProductAddService.getSubBrandExist(param).subscribe(response => {
            this.modalData.config.new_sub_brand.hasError = response.hasError;
            this.modalData.config.new_sub_brand.validationMessage = response.msg;
            if (response.msg === 'Sub-brand name already exists' || data.value === '') {
                this.isDisableCheckCreateBrand(this.isCreateButtonDisabled = true , false);
                this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', true, this.modalData.client_id);
            }
            else if (this.brandForm.invalid) {
                this.modalData.buttons[1].isDisable = 'false';
            }
            else {
                this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', false, this.modalData.client_id);
            }
            this.changeDetector.detectChanges();
        });
    }

    /**
      * Function to enable and disble create button.
      * @param isCreateButtonDisabled
      * @author PSI-Enhancements
      */
    isDisableCheckCreateBrand(isCreateButtonDisabled, isTitle) {
        this.brandForm.valueChanges.subscribe(() => {
            const isFormValid = this.brandForm.valid;
            const isButtonDisable = !(isFormValid && isCreateButtonDisabled);
            this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, isTitle ,isButtonDisable, this.modalData.client_id);
        });
    }

    /**
      * Function to update filters.
      * @param data
      * @author PSI-Enhancements
      */
    updateFilter(data) {
        if (data.event.length > 0 && data.field === 'brand') {
            if ( data.event[0].isNew) {
                this.updateConfig(this.modalData.config.brand, false);
                this.updateConfig(this.modalData.config.new_brands, true);
                this.updateConfig(this.modalData.config.sub_brand_product_id, false);
                this.updateConfig(this.modalData.config.new_sub_brand, true);

                this.modalData.config.net_contents.isDisabled = false;
                this.modalData.config.units_cases.isDisabled = false;

                this.addFieldControl('brand');
                this.addFieldControl('new_brands');
                this.addFieldControl('new_sub_brand');
                this.addFieldControl('sub_brand_product_id');
            } else {
                this.modalData.config.sub_brand_product_id.isDisabled = false;
            }
        }

        if (data.event.length > 0 && data.field === 'sub_brand_product_id') {
            if ( data.event[0].isNew) {
                this.updateConfig(this.modalData.config.sub_brand_product_id, false);
                this.updateConfig(this.modalData.config.new_sub_brand, true);
                this.modalData.config.net_contents.isDisabled = false;
                this.modalData.config.units_cases.isDisabled = false;
                this.addFieldControl('new_brands');
                this.addFieldControl('sub_brand_product_id');
            } else {
                this.modalData.config.net_contents.isDisabled = false;
                this.modalData.config.units_cases.isDisabled = false;
            }
        }

        this.checkValidation()
        this.changeDetector.detectChanges();
    }

    /**
      * Function validation for sub brand creation.
      * @author PSI-Enhancements
      */
    checkValidation() {
        if (this.brandForm.value.sub_brand_product_id && this.brandForm.value.sub_brand_product_id.name === 'Create New') {
            this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', true, this.modalData.client_id);
            this.brandForm.get('sub_brand_product_id').setValue('');
        } else if (
            this.brandForm.value.brand &&
            this.brandForm.value.sub_brand_product_id &&
            this.brandForm.value.net_contents &&
            this.brandForm.value.units_cases
        ) {
            this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', false, this.modalData.client_id);
        } else if (
            this.brandForm.value.new_sub_brand &&
            this.brandForm.value.brand &&
            this.brandForm.value.net_contents &&
            this.brandForm.value.units_cases &&
            !this.modalData.config.new_sub_brand.hasError
        ) {
            this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', false, this.modalData.client_id);
        } else {
            this.modalData = this.ProductAddService.getBrandModalData(this.modalData.config, '', true, this.modalData.client_id);
        }
    }

    /**
      * Function to add fields control for brand and sub-brand.
      * @param fieldName
      * @author PSI-Enhancements
      */
    addFieldControl(fieldName: string) {

        const fieldConfig = this.modalData.config[fieldName];

        if (!fieldConfig) {
            console.warn(`Field ${fieldName} does not exist in config.`);
            return;
        }

        if (!this.brandForm.get(fieldName)) {
            const isRequired = fieldConfig.required || fieldConfig.isRequired;

            this.brandForm.addControl(
                fieldName,
                new FormControl(
                    { value: '', disabled: fieldConfig.isDisabled || false },
                    isRequired ? Validators.required : []
                )
            );
        } else {
            const control = this.brandForm.get(fieldName);
            const isRequired = fieldConfig.required || fieldConfig.isRequired;

            control.setValidators(isRequired ? Validators.required : null);
            control.updateValueAndValidity();
        }

        const control = this.brandForm.get(fieldName);
        if (control) {
            control.markAsTouched();
        }

        this.changeDetector.detectChanges();
    }

    /**
      * Function to update sub-brand client.
      * @param selectedValue
      * @author PSI-Enhancements
      */
    updateSubBrandClient(selectedValue) {
        this.ProductAddService.getSubBrandClients(selectedValue[0]?.client_id, selectedValue[0]?.id).subscribe(subBrands => {
            let sub_brand = [...subBrands, { id: '', name: 'Create New', isNew: true }];
            if (sub_brand && sub_brand.length > 0) {
                this.modalData.config.sub_brand_product_id.options = sub_brand;
                this.modalData = [...this.modalData]
                this.changeDetector.detectChanges();
            }
        });
    }
}
