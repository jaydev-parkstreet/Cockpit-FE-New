import { Component, Input, OnInit } from '@angular/core';
import AppConstant from 'src/app/app.constant';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthService } from '../../authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { ConfirmationModalComponent } from '../../organism/confirmation-modal/confirmation-modal.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { ProductManagementService } from '../product-management.service';

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
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productmanagementService: ProductManagementService
  ) { }

  // Flags and configuration properties
  isErrorRedirect: boolean = false;
  title: any;
  formConfig: any;
  showError: boolean = false;
  activeDropdownId: string | null = null;
  formSubmitted: boolean = false;
  dropdownData:any
  @Input() filterList: any;


  // Dropdown configuration
  dropdownSettings = { versionStyle: 'default' };
  dropdownTexts = {
    noResultText: 'No results found',
    selectAll: 'Select All',
    uncheckAll: 'Uncheck All',
  };



  // Reactive form initialization
  productForm = this.formBuilder.group({
    client_id: ['', [Validators.required]],
    // sub_brand_product_id: ['', [Validators.required]],
    description: ['', [Validators.required]],
    name: [''],
    group: ['', [Validators.required]],
    producer: [''],
    case_unit_of_measure: ['', [Validators.required]],
    container_type: ['', [Validators.required]],
    ex_works_cost: [''],
    is_organic: ['', [Validators.required]],
    prod_type: ['', [Validators.required]],
    product_id: [''],
    abv: [''],
    upc_code: [''],
    scc_code: [''],
    system_id: [''],
    cola_ttb_id: [''],
    nabca_code: [''],
    unimerc_code: [''],
    bdn_code: [''],
    unit_length: [''],
    unit_width: [''],
    unit_height: [''],
    unit_weight: [''],
    pallet_length: [''],
    pallet_width: [''],
    pallet_height: [''],
    pallet_weight: [''],
    case_length: [''],
    case_width: [''],
    case_height: [''],
    case_weight: [''],
    layers_per_pallet: [''],
    cases_per_layer: [''],
    cases_per_pallet: [''],
  });
  

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id')
    this.title = { firstline: AppConstant.PRODUCT.PAGE_TITLE };
    this.initializeFormConfig();
    this.getDropdown()

    if (productId) {
      this.productmanagementService.getDetails(productId).subscribe((productData) => {
        this.prefillForm(productData);
      });
    }
    
    this.productForm.valueChanges.subscribe(() => {
      if (this.formSubmitted) {
        this.showError = false;
      }
    });
  }

  initializeFormConfig(): void {
    this.formConfig = {
      schema: this.createFormSchema(),
      cancelBtnLabel: AppConstant.PRODUCT.CANCEL_BUTTON,
      submitBtnLabel: AppConstant.PRODUCT.SUBMIT_BUTTON,
    };
  }

  createFormSchema() {
    return [
      this.dropdownService.createFilterObj('client_id', 'clients', 'Client', 'Select Client', 'client_id', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      // this.dropdownService.createFilterObj('sub_brand_product_id', 'sub_brand_product_id', 'Sub-Brand Product', 'Select Sub-Brand Product', 'sub_brand_product_id', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true },
      { type: 'text', name: 'name', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false },
      this.dropdownService.createFilterObj('group', 'groups', 'Group', 'Select Group', 'group', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      this.dropdownService.createFilterObj('producer', 'producers', 'Producer', 'Select Producer', 'producer', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      this.dropdownService.createFilterObj('case_unit_of_measure', 'cases_uom', 'Case UOM', 'Select Type', 'case_unit_of_measure', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      this.dropdownService.createFilterObj('container_type', 'container_types', 'Container Type', 'Select Type', 'container_type', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      { type: 'text', name: 'ex_works_cost', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false },
      this.dropdownService.createFilterObj('is_organic', 'organic', 'Organic', 'Select Organic', 'is_organic', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      this.dropdownService.createFilterObj('prod_type', 'product_type', 'Product Type', 'Select Type', 'prod_type', true, true, null, null, 'col-xs-3', null, 'ps-required-asterisk'),
      { type: 'text', name: 'product_id', label: 'Park Street Product Code', placeholder: '', isVisible: true },
      { type: 'text', name: 'abv', label: 'ABV %', placeholder: 'Enter ABV %', isVisible: true },
      { type: 'text', name: 'upc_code', label: 'UPC Code', placeholder: 'UPC Code', isVisible: true },
      { type: 'text', name: 'scc_code', label: 'SCC Code', placeholder: 'SCC Code', isVisible: true },
      { type: 'text', name: 'system_id', label: 'Supplier Reference ID', placeholder: 'Supplier Reference ID', isVisible: true },
      { type: 'text', name: 'cola_ttb_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isVisible: true },
      { type: 'text', name: 'nabca_code', label: 'NABCA Code', placeholder: 'NABCA Code', isVisible: true },
      { type: 'text', name: 'unimerc_code', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isVisible: true },
      { type: 'text', name: 'bdn_code', label: 'BDN Code', placeholder: 'BDN Code', isVisible: true },
      { type: 'text', name: 'unit_length', label: 'Length', placeholder: 'Enter Length', required: false },
      { type: 'text', name: 'unit_width', label: 'Width', placeholder: 'Enter Width', required: false },
      { type: 'text', name: 'unit_height', label: 'Height', placeholder: 'Enter Height', required: false },
      { type: 'text', name: 'unit_weight', label: 'Weight', placeholder: 'Enter Weight', required: false },
      { type: 'text', name: 'pallet_length', label: 'Pallet Length', placeholder: 'Enter Pallet Length', required: false },
      { type: 'text', name: 'pallet_width', label: 'Pallet Width', placeholder: 'Enter Pallet Width', required: false },
      { type: 'text', name: 'pallet_height', label: 'Pallet Height', placeholder: 'Enter Pallet Height', required: false },
      { type: 'text', name: 'pallet_weight', label: 'Pallet Weight', placeholder: 'Enter Pallet Weight', required: false },
      { type: 'text', name: 'case_length', label: 'Case Length', placeholder: 'Enter Case Length', required: false },
      { type: 'text', name: 'case_width', label: 'Case Width', placeholder: 'Enter Case Width', required: false },
      { type: 'text', name: 'case_height', label: 'Case Height', placeholder: 'Enter Case Height', required: false },
      { type: 'text', name: 'case_weight', label: 'Case Weight', placeholder: 'Enter Case Weight', required: false },
      { type: 'text', name: 'layers_per_pallet', label: 'Layers per Pallet', placeholder: 'Enter Layers per Pallet', required: false },
      { type: 'text', name: 'cases_per_layer', label: 'Cases per Layer', placeholder: 'Enter Cases per Layer', required: false },
      { type: 'text', name: 'cases_per_pallet', label: 'Cases per Pallet', placeholder: 'Enter Cases per Pallet', required: false },
    ];
  }
  

  prefillForm(productData: any): void {
    this.productForm.patchValue({
      client_id: this.getDropDownArrayByIds(this.filterList.clients, productData.client_id), // Updated field
      description: productData.description, // Updated field
      name: productData.fanciful_name, // Updated field
      group: this.getDropDownArrayByIds(this.filterList.groups, productData.group_name), // Updated field
      producer: this.getDropDownArrayByIds(this.filterList.producers, productData.producer_name), // Updated field
      case_unit_of_measure: this.getDropDownArrayByIds(this.filterList.cases_uom, productData.case_unit_of_measure), // Updated field
      container_type: this.getDropDownArrayByIds(this.filterList.container_types, productData.container_type), // Updated field
      ex_works_cost: productData.ex_works_cost, // Updated field
      is_organic: this.getDropDownArrayByIds(this.filterList.organic, productData.is_organic), // Updated field
      prod_type: this.getDropDownArrayByIds(this.filterList.product_type, productData.prod_type), // Updated field
      product_id: productData.product_id, // Updated field
      abv: productData.abv, // Updated field
      upc_code: productData.upc_code, // Updated field
      scc_code: productData.scc_code, // Updated field
      system_id: productData.system_id, // Updated field
      cola_ttb_id: productData.cola_ttb_id, // Updated field
      nabca_code: productData.nabca_code, // Updated field
      unimerc_code: productData.unimerc_code, // Updated field
      bdn_code: productData.bdn_code, // Updated field
      unit_length: productData.unit_length, // New field
      unit_width: productData.unit_width, // New field
      unit_height: productData.unit_height, // New field
      unit_weight: productData.unit_weight, // New field
      pallet_length: productData.pallet_length, // New field
      pallet_width: productData.pallet_width, // New field
      pallet_height: productData.pallet_height, // New field
      pallet_weight: productData.pallet_weight, // New field
      case_length: productData.case_length, // New field
      case_width: productData.case_width, // New field
      case_height: productData.case_height, // New field
      case_weight: productData.case_weight, // New field
      layers_per_pallet: productData.layers_per_pallet, // New field
      cases_per_layer: productData.cases_per_layer, // New field
      cases_per_pallet: productData.cases_per_pallet, // New field
    });
  }
  
  getDropDownArrayByIds (list, value) {
    let result = [] ;
    // console.log(list, value);
    for (let i = 0; i < list.length; i++) {
        if (list[i].id === value) {
            result.push(list[i].name);
            return result;
        }
    }
    return result.length===0?null:result;
  }

  onSubmit(form: FormGroup) {
    this.formSubmitted = true;
    this.showError = false;
    console.log("inside ", form.valid);
    console.log("inside error", form);
    if (form.valid) {
      console.log("inside if");
    //   const reqObj = {
    //     clients: form.value.client_id,
    //     description: form.value.description,
    //     name: form.value.name,  // Fanciful Name
    //     groups: form.value.groups,
    //     producer: form.value.producer, // Producer
    //     case_unit_of_measure: form.value.case_unit_of_measure, // Case UOM
    //     container_types: form.value.container_types, // Container Type
    //     ex_works_cost: form.value.ex_works_cost, // Ex Works Cost
    //     organic: form.value.organic, // Organic
    //     product_type: form.value.product_type, // Product Type
    //     product_id: form.value.product_id, // Product ID
    //     abv: form.value.abv, // ABV
    //     upc_code: form.value.upc_code, // UPC Code
    //     scc_code: form.value.scc_code, // SCC Code
    //     system_id: form.value.system_id, // Supplier Reference ID
    //     cola_ttb_id: form.value.cola_ttb_id, // COLA TTB ID
    //     nabca_code: form.value.nabca_code, // NABCA Code
    //     unimerc_code: form.value.unimerc_code, // UNIMERC Code
    //     bdn_code: form.value.bdn_code, // BDN Code
    //     unit_length: form.value.unit_length, // Unit Length
    //     unit_width: form.value.unit_width, // Unit Width
    //     unit_height: form.value.unit_height, // Unit Height
    //     unit_weight: form.value.unit_weight, // Unit Weight
    //     pallet_length: form.value.pallet_length, // Pallet Length
    //     pallet_width: form.value.pallet_width, // Pallet Width
    //     pallet_height: form.value.pallet_height, // Pallet Height
    //     pallet_weight: form.value.pallet_weight, // Pallet Weight
    //     case_length: form.value.case_length, // Case Length
    //     case_width: form.value.case_width, // Case Width
    //     case_height: form.value.case_height, // Case Height
    //     case_weight: form.value.case_weight, // Case Weight
    //     layers_per_pallet: form.value.layers_per_pallet, // Layers per Pallet
    //     cases_per_layer: form.value.cases_per_layer, // Cases per Layer
    //     cases_per_pallet: form.value.cases_per_pallet, // Cases per Pallet
    // };
      

    console.log('Form Submitted:', form.value);
    //  this.openConfirmationPopup('submit');
    this.productmanagementService.getProductManagementSystemSave(form.value).subscribe(response => {

      console.log(response);
      // if (!response.hasError) {
      //     // this.$state.go(this.saveActionState, { "id": response.product_id, "data": { "message": response.msg } }, { reload: true });
      // } else {
      //     // this.confirmPopupOpen = false;
      //     // this.commonService.showFlashMessage(true, response.msg, 'saved-footer');
      // }
  });  
    this.showError = false;
    
    } else {
      this.showError = true;
    }
  }

  async getDropdown(){
    const token = localStorage.getItem('authToken');
    try {
      const response:any = await this.productmanagementService.getDropdown(token);
      this.dropdownData = response.data;
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
    this.filterList = this.dropdownData;
    console.log(this.filterList);
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
  const reqObj = form.value;
  console.log('Form Submitted:', reqObj);
  form.reset();
  //this.simpleModalService.closeModal();
}


  onDropdownStateChange(fieldName , field): void {
    console.log(fieldName, field);
    this.activeDropdownId = field ? (this.activeDropdownId === field ? null : field) : null;
    this.productForm.get(fieldName)?.setValue(field);
  }

  /**
   * Function to track fields and prevent unnecessary re-renders
   */
  trackByField(index: number, field: any): string {
    return field.name;
  }
}
