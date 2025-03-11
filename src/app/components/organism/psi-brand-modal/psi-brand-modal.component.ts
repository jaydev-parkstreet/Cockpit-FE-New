import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { ProductAddService } from '../../product-management/product-add/product-add.service';

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

    constructor(
        private simpleModalService: SimpleModalService,
        private formBuilder: FormBuilder,
        private ProductAddService: ProductAddService,
        private changeDetector: ChangeDetectorRef
    ) {
        super();
    }
    brandForm = this.formBuilder.group({});
    ngOnInit(): void {  
        this.formSubmitted = false;
        this.getFormControl();
    }

    getFormControl() {
        const controls = {};
        Object.keys(this.modalData.config).forEach(key => {
            const field = this.modalData.config[key];
            const isFieldRequired = field.required || field.isRequired;
            console.log(field , field.isRequired);
            const formControl = new FormControl(
                '',
                isFieldRequired ? Validators.required : []
            );
    
            controls[field.name] = formControl;
        });
        this.brandForm = new FormGroup(controls);
        console.log(this.brandForm);
    }
    
    
    
    
    
    cancel(): void {
        this.close();
    }
    onButtonClicked(event) {
        console.log(event);
        if (event === "Cancel") {
            this.result = { confirm: false };
            this.close();
        }
        if (event === "Create") {
            this.formSubmitted = true;
            if (!this.brandForm.invalid) {
                this.result = { confirm: true , formData: this.brandForm.value };
                this.close();
            }
        }
    }

    getConfigArray(config) {
        return Object.keys(config).map(key => config[key]);
    }
    
    /**
     * Updates the value of a dropdown form control.
     * @param field
     * @param event
     * @author psi-enhancement
     */

    onDropdownStateChange(field, event) {
        this.brandForm.get(field)?.setValue(event[0]);
        this.updateFilter({ field, event });
        this.changeDetector.detectChanges();
    }
    /**
     * Updates the form control value based on the input change.
     * @param field
     * @param value
     * @author psi-enhancement
     */
    onInputChange(field, value) {
        this.brandForm.get(field).setValue(value);
        let form = this.brandForm.value;
        let clientId = this.modalData.client_id;
        this.CheckValueExist({ field, value , form }, clientId);
        this.changeDetector.detectChanges();
    }

    /**
      * Returns true if the field is invalid and the form has been submitted.
      * @param controlName
      * @returns boolean
      * @author psi-enhancement
      */
    isFieldInvalid(controlName: string): boolean {
        const control = this.brandForm.get(controlName);
        const field = this.modalData.config[controlName];
        return (control?.invalid || field?.hasError) && this.formSubmitted;
    }

    updateConfig = (config, isDisplayed) => {
        config.display = isDisplayed;
        config.isRequired = isDisplayed;
    };

    CheckValueExist(data, clientId) {
        console.log(data, clientId);
        if (data.field === 'new_brands') {
            const brandExistsObj = {
                client_id: clientId,
                name: data.value
            };
            this.ProductAddService.getBrandExist(brandExistsObj).subscribe(response => {
                if (response.hasError) {
                    this.modalData.config.new_brands.hasError = true;
                    this.modalData.config.new_brands.validationMessage = response.msg;
                } else {
                    this.modalData.config.new_brands.hasError = false;
                    this.modalData.config.new_brands.validationMessage = "";
                }
                this.changeDetector.detectChanges(); // Ensure UI reflects changes
            });
        }
    
        if (data.field === 'new_sub_brand') {
            const brandExistsObj = {
                brand_id: data.form.brand.id,
                client_id: clientId,
                name: data.value
            };
            this.ProductAddService.getSubBrandExist(brandExistsObj).subscribe(response => {
                if (response.hasError) {
                    this.modalData.config.new_sub_brand.hasError = true;
                    this.modalData.config.new_sub_brand.validationMessage = response.msg;
                } else {
                    this.modalData.config.new_sub_brand.hasError = false;
                    this.modalData.config.new_sub_brand.validationMessage = "";
                }
                this.changeDetector.detectChanges(); // Ensure UI reflects changes
            });
        }
    }
    

    updateFilter(data) {
        if (data.field === 'brand') {
            if (data.event[0].isNew) {
                this.updateConfig(this.modalData.config.brand, false);
                this.updateConfig(this.modalData.config.new_brands, true);
                this.updateConfig(this.modalData.config.sub_brand_product_id, false);
                this.updateConfig(this.modalData.config.new_sub_brand, true);
    
                this.modalData.config.net_contents.isDisabled = false;
                this.modalData.config.units_cases.isDisabled = false;
    
                this.addFieldControl('new_brands');
                this.addFieldControl('new_sub_brand');
            } else {
                this.modalData.config.sub_brand_product_id.isDisabled = false;
            }
        }
    
        if (data.field === 'sub_brand_product_id') {
            if (data.event[0].isNew) {
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
    
        this.changeDetector.detectChanges();
    }
    

    addFieldControl(fieldName: string) {
        const fieldConfig = this.modalData.config[fieldName];
    
        if (!fieldConfig) {
            console.warn(`Field ${fieldName} does not exist in config.`);
            return;
        }
    
        // Avoid adding duplicate controls
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
            // If control already exists, update validators
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
    
    
}
