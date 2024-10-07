import { Component, OnInit } from '@angular/core';
import AppConstant from 'src/app/app.constant';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from '../../authentication/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { ConfirmationModalComponent } from '../../organism/confirmation-modal/confirmation-modal.component';
import { SimpleModalService } from 'ngx-simple-modal';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
  constructor(
    private simpleModalService: SimpleModalService,
    public router: Router,
    private dropdownService: InputDropdownService,
    private authService: AuthService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) { }

  // Flags and configuration properties
  isErrorRedirect: boolean = false;
  title: any;
  formConfig: any;
  showError: boolean = false;
  activeDropdownId: string | null = null;
  formSubmitted: boolean = false;

  // Dropdown configuration
  dropdownSettings = { versionStyle: 'default' };
  dropdownTexts = {
    noResultText: 'No results found',
    selectAll: 'Select All',
    uncheckAll: 'Uncheck All',
  };
  dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];


  // Reactive form initialization
  productForm = this.formBuilder.group({
    sub_brand: ['', [Validators.required]],
    description: ['', [Validators.required]],
    fancifulName: [''],
    group: ['', [Validators.required]],
    producer: [''],
    caseuom: ['', [Validators.required]],
    containerType: ['', [Validators.required]],
    announcedPrice: [''],
    classType: [''],
    ct: [''],
    or: [''],
    organic: ['', [Validators.required]],
    productType: ['', [Validators.required]],
    transaction_type: [''],
    productCode: [''],
    upcCode: [''],
    sccCode: [''],
    suplier_id: [''],
    cola_id: [''],
    nabca: [''],
    unimerc: [''],
    bdn: [''],
  });

  ngOnInit(): void {
    this.title = { firstline: AppConstant.PRODUCT.PAGE_TITLE };
    this.formConfig = {
      schema: [
        this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true },
        { type: 'text', name: 'fancifulName', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false },
        this.dropdownService.createFilterObj('group', 'group', 'Group', 'Select group', 'group', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        { type: 'text', name: 'producer', label: 'Producer', placeholder: 'Enter Producer', required: false },
        this.dropdownService.createFilterObj('caseuom', 'caseuom', 'Case UOM', 'Select Type', 'caseuom', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        this.dropdownService.createFilterObj('containerType', 'containerType', 'Container Type', 'Select Type', 'containerType', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        { type: 'text', name: 'announcedPrice', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false },
        { type: 'text', name: 'classType', label: 'Class / Type Description', placeholder: 'Enter Class / Type Description', required: false },
        { type: 'text', name: 'ct', label: 'CT', placeholder: '', required: false },
        { type: 'text', name: 'or', label: 'OR', placeholder: '', required: false },
        this.dropdownService.createFilterObj('organic', 'organic', 'Organic', 'Select Organic', 'organic', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        this.dropdownService.createFilterObj('productType', 'productType', 'Product Type', 'Select Type', 'productType', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
        { type: 'text', name: 'productCode', label: 'Park Street Product Code', placeholder: '', isVisible: true },
        { type: 'text', name: 'upcCode', label: 'UPC Code', placeholder: 'UPC Code', isVisible: true },
        { type: 'text', name: 'sccCode', label: 'SCC Code', placeholder: 'SCC Code', isVisible: true },
        { type: 'text', name: 'suplier_id', label: 'Supplier Reference ID', placeholder: 'Supplier Reference ID', isVisible: true },
        { type: 'text', name: 'cola_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isVisible: true },
        { type: 'text', name: 'nabca', label: 'NABCA Code', placeholder: 'NABCA Code', isVisible: true },
        { type: 'text', name: 'unimerc', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isVisible: true },
        { type: 'text', name: 'bdn', label: 'BDN Code', placeholder: 'BDN Code', isVisible: true },
      ],
      cancelBtnLabel: AppConstant.PRODUCT.CANCEL_BUTTON,
      submitBtnLabel: AppConstant.PRODUCT.SUBMIT_BUTTON,
    };

    // Subscribe to form value changes
    this.productForm.valueChanges.subscribe(() => {
      if (this.formSubmitted) {
        this.showError = false;
      }
    });
  }

  onSubmit(form: FormGroup) {
    this.formSubmitted = true;
    this.showError = false;

    if (form.valid) {

        const reqObj = {
            sub_brand: form.value.sub_brand,
            description: form.value.description,
            fancifulName: form.value.fancifulName,
            group: form.value.group,
            producer: form.value.producer,
            caseuom: form.value.caseuom,
            containerType: form.value.containerType,
            announcedPrice: form.value.announcedPrice,
            classType: form.value.classType,
            ct: form.value.ct,
            or: form.value.or,
            organic: form.value.organic,
            productType: form.value.productType,
            transaction_type: form.value.transaction_type,
            productCode: form.value.productCode,
            upcCode: form.value.upcCode,
            sccCode: form.value.sccCode,
            suplier_id: form.value.suplier_id,
            cola_id: form.value.cola_id,
            nabca: form.value.nabca,
            unimerc: form.value.unimerc,
            bdn: form.value.bdn,
        };

      console.log('Form Submitted:', reqObj);
    //  this.openConfirmationPopup('submit');
      
      this.showError = false;
    
    } else {
      this.showError = true;
    }
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control?.invalid && (this.showError || this.formSubmitted);
  }

  handleDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  openConfirmationPopup() {
    let modalData;

        modalData = {
            title: 'All data will be lost!',
            body: 'Are you sure you wish to exit?',
            closeBtnName: 'No',
            confirmBtnName: 'Yes',
            iconClass: 'fas fa-exclamation-circle error',
            showLine: true,
        };

    this.simpleModalService.addModal(ConfirmationModalComponent, {
        modalData: modalData,
    });
}
confirmSubmission(form: FormGroup) {
  // Logic to handle the form submission after confirmation
  const reqObj = form.value; // Construct your request object here
  console.log('Form Submitted:', reqObj);

  // Reset the form values
  form.reset(); // This will clear all the form fields

  // Optionally, close the modal after submission
  //this.simpleModalService.closeModal();
}


  onDropdownStateChange(id: string | null): void {
    this.activeDropdownId = id ? (this.activeDropdownId === id ? null : id) : null; // Toggle active dropdown
  }

  /**
   * Function to track fields and prevent unnecessary re-renders
   */
  trackByField(index: number, field: any): string {
    return field.name;
  }
}
