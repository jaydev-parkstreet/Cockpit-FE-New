import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
// import AppConstant from 'src/app/app.constant';
import { CommonService } from 'src/app/core/services/common.service';
// import { AuthService } from '../../authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, Form } from '@angular/forms';
// import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
// import { ConfirmationModalComponent } from '../../organism/confirmation-modal/confirmation-modal.component';
// import { SimpleModalService } from 'ngx-simple-modal';
import { ProductManagementService } from '../product-management.service';
// import { NgxSpinnerService } from 'ngx-spinner';
import { ProductAddService } from './product-add.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
})
export class ProductAddComponent implements OnInit {
    leftTitle: string;
    productTitle: string;
    rightHeaderBottomTitle: string;
    crudFieldConfig: any;
    crudFiltersList: any;
    permissions: any;
    sellectedData: any= {};
    @Output() updateFilters = new EventEmitter<any>();
//   duplicate: boolean = false;
  constructor(
    private ProductAddService: ProductAddService,
    private changeDetector: ChangeDetectorRef,
  //   private simpleModalService: SimpleModalService,
    public router: Router,
  //   private dropdownService: InputDropdownService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productmanagementService: ProductManagementService,
	// private spinner : NgxSpinnerService,
    private commonService : CommonService
  ) { }

//   // Flags and configuration properties

//   isErrorRedirect: boolean = false;
//   title: any;
  clientId: any;
//   formConfig: any;
//   showError: boolean = false;
  activeDropdownId: string | null = null;
//   formSubmitted: boolean = false;
//   dropdownData: any
//   @Input() filterList?: any;
//   filters: any[] = [];
  brand: any[] = [];
  sub_brand_product_id: any[] = [];
//   @Output() dropdownStateChange = new EventEmitter<{ fieldName: string, isDisabled: boolean }>();
  isBrandDisabled: boolean = true;
  isSubBrandDisabled: boolean = true;
//   product: any = {};
//   model: any = {}; 
//   modelFormat: any = {}; 
//   filtersList: any = {}; 
//   permissions: any = {}; 
  subBrandProducts: any[] = []; 
//   caseUnitOfMeasure: any; 
//   uniqueId: any; 
//   productId:any
//   edit: boolean = false; 
  defaultValues = { 
    compliance: 1,  
    use_up: false,
    case_unit_of_measure: null
  };
  

//   // Dropdown configuration
//   dropdownSettings = { versionStyle: 'default' };
//   dropdownTexts = {
//     noResultText: 'No results found',
//     selectAll: 'Select All',
//     uncheckAll: 'Uncheck All',
//   };



//   // Reactive form initialization
  productForm = this.formBuilder.group({
    client_id: ['', [Validators.required]],
    // brand: ['', [Validators.required]],
    brand: [{ value: '', disabled: this.isBrandDisabled }, [Validators.required]],
    sub_brand_product_id: [{ value: '', disabled: this.isSubBrandDisabled }, [Validators.required]],
    description: ['', [Validators.required]],
    name: [''],
    group: ['', [Validators.required]],
    producer: [''],
    case_unit_of_measure: [this.defaultValues.case_unit_of_measure, [Validators.required]],
    container_type: ['', [Validators.required]],
    ex_works_cost: [''],
    is_organic: ['', [Validators.required]],
    prod_type: ['', [Validators.required]],
    sub_type: ['',[Validators.required]],
    category:  ['',[Validators.required]],
    source:  ['',[Validators.required]],
    country: ['',[Validators.required]],
    vintage:  ['',[Validators.required]],
    varietal:  [''],
    compliance: [this.defaultValues.compliance, Validators.required],
    product_id: [''],
    abv: [''],
    manufactured_location_address: [''],
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
    sub_brand_product_name: ['']
  });


  ngOnInit(): void {
    this.permissions = this.route.snapshot.data['permissions'];
    this.crudFiltersList = this.route.snapshot.data['filterList'];
    this.crudFieldConfig = this.ProductAddService.getCrudFieldConfig(this.crudFiltersList);
    this.leftTitle = 'PRODUCT DETAILS';
    this.productTitle = 'Dimensions';
    this.rightHeaderBottomTitle = 'Codes';
//     if (!this.permissions.permissions.Create) {
//       this.router.navigate(['product-management']);
//     }
//     let productId = this.route.snapshot.paramMap.get('id');
//     this.filterList = this.route.snapshot.data['filterList'];
//     this.title = { firstline: AppConstant.PRODUCT.PAGE_TITLE };
//     this.duplicate = this.route.snapshot.data.isDuplicate || false;
//     this.initializeFormConfig();
//     this.filters = this.createFormSchema();
//     if (productId) {
//       this.edit =  true;
//     }
//     else {
//       this.edit =  false;
//     } 

//     if (productId) {
//         this.getProductData(productId);
//     }

//     this.productForm.valueChanges.subscribe(() => {
//       if (this.formSubmitted) {
//         this.showError = false;
//       }
//     });  
//     const controls = {};
//     this.formConfig.schema.forEach(field => {
//       const isDisabled = field.disabled || false;
//       const formControl = new FormControl(
//         { value: '', disabled: isDisabled },
//         field.required ? Validators.required : null
//       );
//       controls[field.name] = formControl;
//     }); 
//     // this.productForm = new FormGroup(controls);
//     this.model = this.productForm.value; 
//     this.filtersList = this.filterList || {}; 
//     this.caseUnitOfMeasure = this.filtersList.case_unit_of_measure || [];
//     this.filtersList.case_unit_of_measure = this.productmanagementService.formatDropdownValue(this.caseUnitOfMeasure);
//     this.modelFormat = this.productmanagementService.formatModelProductTool(this.model, this.filtersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId,this.productId);

  }


//   initializeFormConfig(): void {
//     this.formConfig = {
//       schema: this.createFormSchema(),
//       cancelBtnLabel: AppConstant.PRODUCT.CANCEL_BUTTON,
//       submitBtnLabel: AppConstant.PRODUCT.SUBMIT_BUTTON,
//     };
//     this.formConfig.schema.forEach(field => {
//       if (field.disabled) {
//           this.productForm.get(field.name)?.disable();
//       }
//     });
//     this.updateBrandFilter() 
//   }

//   createFormSchema() {
//     return [
//       this.dropdownService.createFilterObj('client_id', 'clients', 'Supplier', 'Select Supplier', 'client_id', true, true, null, 'client_id', 'col-xs-3', null, false, false, 'ps-required-asterisk', false),
//       this.dropdownService.createFilterObj('brand', 'brand', 'Brand', 'Select Brand', 'brand', true, true, null, null, 'col-xs-3', null, false, false, 'ps-required-asterisk', this.isBrandDisabled),
//       this.dropdownService.createFilterObj('sub_brand_product_id', 'sub_brand_product_id', 'Sub-Brand Product', 'Select Sub-Brand Product', 'sub_brand_product_id', true, true, null, null, 'col-xs-3', null, false, false, 'ps-required-asterisk', this.isSubBrandDisabled),
//       { type: 'text', name: 'description', label: 'Description', placeholder: 'Enter Description', required: true },
//       { type: 'text', name: 'name', label: 'Fanciful Name', placeholder: 'Enter Fanciful Name', required: false },
//       this.dropdownService.createFilterObj('group', 'groups', 'Group', 'Select Group', 'group', true, true, null, null, 'col-xs-3', null, false,false,'ps-required-asterisk'),
//       this.dropdownService.createFilterObj('producer', 'producers', 'Producer', 'Select Producer', 'producer', false, true, null, null, 'col-xs-3', null, false,false,''),
//       this.dropdownService.createFilterObj('case_unit_of_measure', 'cases_uom', 'Case UOM', 'Select Type', 'case_unit_of_measure', true, true, null, null, 'col-xs-3', null,false,false, 'ps-required-asterisk'),
//       this.dropdownService.createFilterObj('container_type', 'container_types', 'Container Type', 'Select Type', 'container_type', true, true, null, null, 'col-xs-3', null,false,false, 'ps-required-asterisk'),
//       { type: 'text', name: 'ex_works_cost', label: 'Announced Price', placeholder: 'Enter Announced Price', required: false },
//       this.dropdownService.createFilterObj('is_organic', 'organic', 'Organic', 'Select Organic', 'is_organic', true, true, null, null, 'col-xs-3', null,false,false, 'ps-required-asterisk'),
//       this.dropdownService.createFilterObj('prod_type', 'product_type', 'Product Type', 'Select Type', 'prod_type', true, true, null, null, 'col-xs-3', null, false,false,'ps-required-asterisk'),
//       { type: 'checkbox', name: 'compliance', label: 'Compliance', placeholder: 'Compliance' },
//       { type: 'text', name: 'product_id', label: 'Park Street Product Code', placeholder: '',  isCode: true , disabled: true},
//       { type: 'text', name: 'upc_code', label: 'UPC Code', placeholder: 'UPC Code', isCode: true },
//       { type: 'text', name: 'scc_code', label: 'SCC Code', placeholder: 'SCC Code',isCode: true  },
//       { type: 'text', name: 'system_id', label: 'Supplier Reference ID', placeholder: 'Supplier Reference ID', isCode:true },
//       { type: 'text', name: 'unit_length', label: 'Length', placeholder: 'Enter Length', required: false, isDimension: true, dimensionType: 'unit'},
//       { type: 'text', name: 'unit_width', label: 'Width', placeholder: 'Enter Width', required: false,isVisible: true, isDimension: true, dimensionType: 'unit'},
//       { type: 'text', name: 'unit_height', label: 'Height', placeholder: 'Enter Height', required: false, isDimension: true, dimensionType: 'unit'},
//       { type: 'text', name: 'unit_weight', label: 'Weight', placeholder: 'Enter Weight', required: false, isDimension: true, dimensionType: 'unit' },
//       { type: 'text', name: 'pallet_length', label: 'Pallet Length', placeholder: 'Enter Pallet Length', required: false, isDimension: true, dimensionType: 'pallet' },
//       { type: 'text', name: 'pallet_width', label: 'Pallet Width', placeholder: 'Enter Pallet Width', required: false, isDimension: true, dimensionType: 'pallet' },
//       { type: 'text', name: 'pallet_height', label: 'Pallet Height', placeholder: 'Enter Pallet Height', required: false, isDimension: true, dimensionType: 'pallet' },
//       { type: 'text', name: 'pallet_weight', label: 'Pallet Weight', placeholder: 'Enter Pallet Weight', required: false, isDimension: true, dimensionType: 'pallet' },
//       { type: 'text', name: 'case_length', label: 'Case Length', placeholder: 'Enter Case Length', required: false, isDimension: true, dimensionType: 'case' },
//       { type: 'text', name: 'case_width', label: 'Case Width', placeholder: 'Enter Case Width', required: false, isDimension: true, dimensionType: 'case' },
//       { type: 'text', name: 'case_height', label: 'Case Height', placeholder: 'Enter Case Height', required: false, isDimension: true, dimensionType: 'case' },
//       { type: 'text', name: 'case_weight', label: 'Case Weight', placeholder: 'Enter Case Weight', required: false, isDimension: true, dimensionType: 'case' },
//       { type: 'text', name: 'layers_per_pallet', label: 'Layers per Pallet', placeholder: 'Enter Layers per Pallet', required: false, isDimension: true, dimensionType: 'layer' },
//       { type: 'text', name: 'cases_per_layer', label: 'Cases per Layer', placeholder: 'Enter Cases per Layer', required: false, isDimension: true, dimensionType: 'layer' },
//       { type: 'text', name: 'cases_per_pallet', label: 'Cases per Pallet', placeholder: 'Enter Cases per Pallet', required: false, isDimension: true, dimensionType: 'layer' },
//     ];
//   }

  // async getProductData(productId) {
  //   this.productmanagementService.getDetails(productId).subscribe((productData) => {
  //       this.renderConditionalFields(productData.prod_type)
  //        this.productId = productData.product_id;
  //        setTimeout(() => {
  //         if (this.duplicate) {
  //           delete productData.product_id;
  //         }
  //         if (!this.duplicate) {
  //             this.uniqueId = productData.id;
  //         }
  //         this.modelFormat = this.productmanagementService.formatModelProductTool(productData, this.filtersList, this.subBrandProducts, this.edit, this.duplicate, this.uniqueId,this.productId);
  //         this.prefillForm(productData);
  //        }, 100);     
  //   });
//   }
//   prefillForm(productData: any): void { 
//   this.applyDisableEnableForBrandAndSubBrand();
//     this.productForm.patchValue({
//       client_id: this.getDropDownArrayByIds(this.filterList?.clients, productData.client_id , 'client_id'),
//       description: productData.description,
//       name: productData.fanciful_name,
//       group: this.getDropDownArrayByIds(this.filterList?.groups, productData.group_id, 'group'),
//       producer: this.getDropDownArrayByIds(this.filterList?.producers, productData.producer_id, 'producer'),
//       case_unit_of_measure: this.getDropDownArrayByIds(this.filterList?.cases_uom, productData.case_unit_of_measure, 'case_unit_of_measure'),
//       container_type: this.getDropDownArrayByIds(this.filterList?.container_types, productData.container_type, 'container_type'),
//       ex_works_cost: productData.ex_works_cost,
//       is_organic: this.getDropDownArrayByIds(this.filterList?.organic, productData.is_organic, 'is_organic'),
//       prod_type: this.getDropDownArrayByIds(this.filterList?.product_type, productData.prod_type, 'prod_type'),   
//       sub_type: this.getDropDownArrayByIds(this.filterList?.product_sub_type, productData.sub_type, 'sub_type'),
//       category: this.getDropDownArrayByIds(this.filterList?.categories, productData.category_id, 'category'),
//       source: this.getDropDownArrayByIds(this.filterList?.source, productData.source, 'source'),
//       country: this.getDropDownArrayByIds(this.filterList?.countries, productData.country_id, 'country'),
//       vintage: this.getDropDownArrayByIds(this.filterList?.vintages, productData.vintage, 'vintage'),
//       varietal: this.getDropDownArrayByIds(this.filterList?.varietals, productData.varietal, 'varietal'),
//       product_id: productData.product_id,
//       abv: productData.abv,
//       manufactured_location_address: productData?.manufactured_location_address,
//       upc_code: productData.upc_code,
//       scc_code: productData.scc_code,
//       system_id: productData.system_id,
//       cola_ttb_id: productData.cola_ttb_id,
//       nabca_code: productData.nabca_code,
//       unimerc_code: productData?.unimerc_code,
//       bdn_code: productData.bdn_code,
//       unit_length: productData.unit_length,
//       unit_width: productData.unit_width,
//       unit_height: productData.unit_height,
//       unit_weight: productData?.unit_weight,
//       pallet_length: productData?.pallet_length,
//       pallet_width: productData?.pallet_width,
//       pallet_height: productData?.pallet_height,
//       pallet_weight: productData?.pallet_weight,
//       case_length: productData?.case_length,
//       case_width: productData?.case_width,
//       case_height: productData?.case_height,
//       case_weight: productData?.case_weight,
//       layers_per_pallet: productData.layers_per_pallet,
//       cases_per_layer: productData.cases_per_layer,
//       cases_per_pallet: productData.cases_per_pallet,
//     });
//     let clientId = this.productForm.value.client_id[0];
//     this.updateBrandAndSubBrandControls(clientId.class_id, productData.brand_id, productData.sub_brand_product_id);
//     this.productForm.get("client_id").setValue(clientId.id);
//     this.productForm.updateValueAndValidity();
//   }
// //   callSubBrandProduct(id) {
// // 	this.spinner.show('app-loader');
// // 	this.filtersList.sub_brands_products = [];
// // 	this.form[0].items[0].items[0].items[0].items[1].items[0].titleMap = [];
// // 	this.productToolService.getSubBrandProducts(id).then(response => {
// // 		this.form[0].items[0].items[0].items[0].items[1].items[0].disabled = false;
// // 		this.usSpinnerService.stop('app-loader');
// // 		if (!response.hasError) {
// // 			response.data = [{ id: 'Create New', name: 'Create New' }].concat(response.data);
// // 			this.filtersList.sub_brands_products = response.data;
// // 			if (this.model.sub_brand_product_id) {
// // 				this.model.sub_brand_product_id = this.filtersList.sub_brands_products.filter((subBrandProduct) => {
// // 					return subBrandProduct.id === this.model.sub_brand_product_id;
// // 				});
// // 			}
// // 			if (this.edit || this.duplicate) {
// // 				this.modelOld = angular.copy(this.model);
// // 				this.x.$broadcast('schemaFormValidate');
// // 			}
// // 			this.form[0].items[0].items[0].items[0].items[1].items[0].titleMap = response.data;
// // 			this.form[0].items[0].items[0].items[0].items[1].items[0].setting = this.productToolCrudService.getClientDropdownSetting(
// // 				this.filtersList, 'sub_brands_products');
// // 		}
// // 	});
// // }
  getDropDownArrayByIds (list, value, name) {
    let result = [] ;
    for (let i = 0; i < list?.length; i++) {
      if (list[i].id == value) {
        result.push(list[i]);
        this.sellectedData[name] = result
        return result;
      }
      
    }
    return result.length === 0 ? null : result;
  }
//   applyDisableEnableForBrandAndSubBrand() {
//       const brandControl = this.productForm.get('brand');
//       const subBrandControl = this.productForm.get('sub_brand_product_id');

//       if (brandControl) {
//           if (this.isBrandDisabled) {
//               brandControl.disable();
//               brandControl.setValue('');
//               this.isSubBrandDisabled = true;
//               if (subBrandControl) {
//                   subBrandControl.disable();
//                   subBrandControl.setValue('');
//               }
//           } else {
//               brandControl.enable();
//           }
//       }
//       if (subBrandControl) {
//           if (this.isSubBrandDisabled) {
//               subBrandControl.disable();
//               subBrandControl.setValue('');
//           } else {
//               subBrandControl.enable();
//           }
//       }
//   }
//   changeComplianceValue(isChecked: boolean, fieldName: string) {
//     this.productForm.get(fieldName)?.setValue(isChecked ? '1' : '0');
//   }

//   onSubmit(form: FormGroup) {
//     this.formSubmitted = true;
//     this.showError = false;
//     if (form.valid) {
   
//       const formattedModel = this.productmanagementService.formatModelProductTool(
//         this.productForm.value,
//         this.filtersList,
//         this.subBrandProducts,
//         this.edit,
//         this.duplicate,
//         this.uniqueId,
//         this.productId
//     );
//       formattedModel.compliance = formattedModel.compliance ? 1 : 0;
//       if (this.productForm.value.prod_type === 2 || this.productForm.value.prod_type === 4 || this.productForm.value.prod_type === 5) {
//         formattedModel.sub_type = formattedModel.sub_type1;
//       } else if (this.productForm.value.prod_type === 1 || this.productForm.value.prod_type === 3) {
//         formattedModel.sub_type = formattedModel.sub_type2;
//       }

//       delete formattedModel.sub_type1;
//       delete formattedModel.sub_type2;
//       delete formattedModel.isShowMore;
//       this.productmanagementService.getProductManagementSystemSave(formattedModel).subscribe(response => {
//         if (!response.hasError) {
//           this.showError = false;
//           let productId = response.product_id; 
//           if (this.edit) {
//             this.commonService.showToastV2Message(true, 'Edited Successfully!', 'fas fa-exclamation-circle');
//             this.router.navigateByUrl(`/product-management/${productId}`);
//           } else {
//             this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle');
//             this.router.navigateByUrl(`/product-management/${productId}`);
//           }


//       } else {
//         // this.spinner.hide();
//         // this.confirmPopupOpen = false;
//         this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
//         this.showError = true;
//       }
//   });  
//     this.showError = false;
//     } else {
//       this.showError = true;
//     }
//   }

//   isFieldInvalid(controlName: string): boolean {
//     const control = this.productForm.get(controlName);
//     return control?.invalid && (this.showError || this.formSubmitted);
//   }

//   handleDropdownClick(event: MouseEvent) {
//     event.stopPropagation();
//   }

//   openConfirmationPopup() {
//     let modalData;

//     modalData = {
//       title: 'All data will be lost.',
//       body: 'Are you sure you wish to exit?',
//       closeBtnName: 'No',
//       confirmBtnName: 'Yes',
//       iconClass: 'fas fa-exclamation-circle error',
//       showLine: true,
//     };

//         this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
//             .subscribe((result) => {
//                 if (result.confirm) {
//                     this.router.navigate(["/product-management"])
//                 }
//             });
//     }
// confirmSubmission(form: FormGroup) {
//   const reqObj = form.value;
//   form.reset();
//   //this.simpleModalService.closeModal();
// }



//   // onDropdownStateChange(fieldName , field): void {
//   //   this.activeDropdownId = field ? (this.activeDropdownId === field ? null : field) : null;
// 	// if(fieldName == 'container_type' || fieldName == 'sub_brand_product_id'){
// 	// 	this.productForm.get(fieldName)?.setValue(field[0].id);
// 	// }else {
// 	// 	this.productForm.get(fieldName)?.setValue(field[0].name);
// 	// }
//     // this.productForm.get(fieldName)?.setValue(field[0].name);

  onDropdownStateChange(fieldName: any, selectedValue: any) {
      this.activeDropdownId = selectedValue ? (this.activeDropdownId === selectedValue ? null : selectedValue) : null;
      if(fieldName == 'container_type'  || fieldName == "client_id" || fieldName == "group" 
        || fieldName == "is_organic" || fieldName == "producer" || fieldName == "case_unit_of_measure" || fieldName == "brand"
        || fieldName == "varietal" || fieldName ==  "vintage" || fieldName == "sub_type" || fieldName == "category" || fieldName == "source" 
        || fieldName == "country"){
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
      this.updatesellectedData('brand','Select Brand');
      this.updatesellectedData('sub_brand_product_id','Select Sub-Brand Product');
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
      this.updatesellectedData('sub_brand_product_id','Select Sub-Brand Product');
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
      this.renderConditionalFields(selectedValue[0].name , this.crudFiltersList , this.productForm);
      this.crudFieldConfig = { ...this.crudFieldConfig };
      this.changeDetector.detectChanges();
    } 
  
  }
  updateSubBrandFilter() {
    if (this.sub_brand_product_id && this.sub_brand_product_id.length > 0) {
      this.crudFiltersList['sub_brand_product_id'] = this.sub_brand_product_id;
      this.subBrandProducts = this.sub_brand_product_id;
      this.crudFieldConfig.rightSection[2].options = this.sub_brand_product_id;
      this.crudFieldConfig.rightSection[2].isDisabled = false
      this.crudFieldConfig = { ...this.crudFieldConfig };
      this.changeDetector.detectChanges();
    }
  }

  updateBrandFilter() {
    if (this.brand && this.brand.length > 0) {
      this.crudFiltersList['brand'] = this.brand;
      console.log(this.crudFieldConfig.rightSection);
      this.crudFieldConfig.rightSection[1].options = this.brand
      this.crudFieldConfig.rightSection[1].isDisabled = false
      this.crudFieldConfig = { ...this.crudFieldConfig };
      this.changeDetector.detectChanges();
    }
  }
  


//     renderConditionalFields(selectedValue: any) {
//         const fieldExists = (fieldName: string) => {
//             return this.formConfig.schema.some(field => field.name === fieldName);
//         };

//         const baseFields = [
//             this.dropdownService.createFilterObj('sub_type', 'product_sub_type', 'Sub-Type', 'Select Sub-Type', 'sub_type', true, true, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
//             this.dropdownService.createFilterObj('category', 'categories', 'Category', 'Select Category', 'category', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
//             this.dropdownService.createFilterObj('source', 'source', 'Source', 'Select Source', 'source', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
//             this.dropdownService.createFilterObj('country', 'countries', 'Country', 'Select Country', 'country', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
//             { type: 'text', name: 'abv', label: 'ABV %', placeholder: 'Enter ABV %', required: true },
//             { type: 'text', name: 'cola_ttb_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isCode: true, required: true },
//             { type: 'text', name: 'nabca_code', label: 'NABCA Code', placeholder: 'NABCA Code', isCode: true },
//             { type: 'text', name: 'unimerc_code', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isCode: true },
//             { type: 'text', name: 'bdn_code', label: 'BDN Code', placeholder: 'BDN Code', isCode: true },
//             { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address'},
//         ];

    //     const baseFields = [
    //         {
    //           key: 'sub_type',
    //           label: 'Sub-Type',
    //           type: 'multiselect-dropdown',
    //           colClass: 'col-xs-12',
    //           filters: { entity: [] },
    //           options: this.crudFiltersList.product_sub_type || [],
    //           isRequired: true,
    //           isDisabled: false,
    //           inputSetting: this.commonService.getDropdownConfig('Select Sub-Type', true)
    //         }
    //         this.dropdownService.createFilterObj('sub_type', 'product_sub_type', 'Sub-Type', 'Select Sub-Type', 'sub_type', true, true, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //         this.dropdownService.createFilterObj('category', 'categories', 'Category', 'Select Category', 'category', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //         this.dropdownService.createFilterObj('source', 'source', 'Source', 'Select Source', 'source', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //         this.dropdownService.createFilterObj('country', 'countries', 'Country', 'Select Country', 'country', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //         { type: 'text', name: 'abv', label: 'ABV %', placeholder: 'Enter ABV %', required: true },
    //         { type: 'text', name: 'cola_ttb_id', label: 'COLA TTB ID', placeholder: 'COLA TTB ID', isCode: true, required: true },
    //         { type: 'text', name: 'nabca_code', label: 'NABCA Code', placeholder: 'NABCA Code', isCode: true },
    //         { type: 'text', name: 'unimerc_code', label: 'UNIMERC Code', placeholder: 'UNIMERC Code', isCode: true },
    //         { type: 'text', name: 'bdn_code', label: 'BDN Code', placeholder: 'BDN Code', isCode: true },
    //         { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address'},
    //     ];

    //     const conditionalFields = {
    //         wine: [
    //             this.dropdownService.createFilterObj('vintage', 'vintages', 'Vintage', 'Select Vintage', 'vintage', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //             this.dropdownService.createFilterObj('varietal', 'varietals', 'Varietal', 'Select Varietal', 'varietal', false, false, null, null, 'col-xs-3', true, false, false, '', false)
    //         ],
    //         malt: [
    //           this.dropdownService.createFilterObj('vintage', 'vintages', 'Vintage', 'Select Vintage', 'vintage', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
               
    //            // this.dropdownService.createFilterObj('varietal', 'varietals', 'Varietal', 'Select Varietal', 'varietal', false, false, null, null, 'col-xs-3', true, false, false, '', false) // only varietal
    //         ],
    //         spirits: [
    //             this.dropdownService.createFilterObj('vintage', 'vintages', 'Vintage', 'Select Vintage', 'vintage', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false) // only vintage
    //         ],
    //         bulk: [
    //           this.dropdownService.createFilterObj('sub_type', 'product_sub_type', 'Sub-Type', 'Select Sub-Type', 'sub_type', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //           { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address' }
    //       ],
    //       other: [
    //         this.dropdownService.createFilterObj('sub_type', 'product_sub_type', 'Sub-Type', 'Select Sub-Type', 'sub_type', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false),
    //           { type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address'}
    //       ]
    //     };
        
    //     const removeFields = (fieldsToRemove: string[]) => {
    //       fieldsToRemove.forEach(fieldName => {          
    //           const control = this.productForm.get(fieldName);
    //           if (control) {
    //               control.setValue(""); 
    //               control.clearValidators(); 
    //               control.updateValueAndValidity(); 
    //           }
    //           const fieldIndex = this.formConfig.schema.findIndex(field => field.name === fieldName);
    //           if (fieldIndex !== -1) {
    //               this.formConfig.schema.splice(fieldIndex, 1);
    //           }
    //       });
    //   };   
  
    //     const addFieldControl = (field) => {
    //         if (field.required) {
    //           this.productForm.addControl(
    //                field.name,
    //                new FormControl('', Validators.required) 
    //            );
    //           } else {
    //              this.productForm.addControl(field.name, new FormControl(''));
    //           }
    //        const control = this.productForm.get(field.name);
    //           if (control) {
    //            control.markAsTouched();
    //          }
    //       };
    //       const addValidators = (controlName: string) => {
    //         const control = this.productForm.get(controlName);
    //         if (control) {
    //           control.setValidators([Validators.required]);
    //           control.updateValueAndValidity();  // Re-validate the control
    //         }
    //       };
            
    //     switch (selectedValue) {
    //         case 'Wine':
    //             baseFields.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                     addValidators('sub_type');
    //                     addValidators('category');
    //                     addValidators('source');
    //                     addValidators('country');
    //                     addValidators('vintage');
    //                 }                  
    //             });
    //             conditionalFields.wine.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                 }
    //             });
    //             break;
    //         case 'Malt':
    //             baseFields.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                 }
       
    //             });
    //             conditionalFields.malt.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                 }
    //             });
    //             removeFields([ 'varietal']);
    //             break;
    //         case 'Spirits':
    //             baseFields.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                 }
    //             });
    //             conditionalFields.spirits.forEach(field => {
    //                 if (!fieldExists(field.name)) {
    //                     this.formConfig.schema.push(field);
    //                     addFieldControl(field);
    //                 }
    //             });
    //             break;
    //         case 'Bulk':
    //         case 'Other':
    //             if (!fieldExists('sub_type')) {
    //                 this.formConfig.schema.push(this.dropdownService.createFilterObj('sub_type', 'product_sub_type', 'Sub-Type', 'Select Sub-Type', 'sub_type', true, false, null, null, 'col-xs-3', true, false, false, 'ps-required-asterisk', false));
    //             }
    //             if (!fieldExists('manufactured_location_address')) {
    //                 this.formConfig.schema.push({ type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address'});
    //             }
    //             removeFields(['vintage', 'varietal','category','source','country','abv']);
    //             break;
    //         default:
    //             if (!fieldExists('manufactured_location_address')) {
    //                 this.formConfig.schema.push({ type: 'text', name: 'manufactured_location_address', label: 'Manufactured Location Address', placeholder: 'Enter Manufactured Location Address'});
    //             }
    //             break;
    //     }
    // }

    
  /**
   * Function to track fields and prevent unnecessary re-renders
   */
  trackByField(index: number, field: any): string {
    return field.name;
  }
  
    updateFormControl(controlName: string, filterKey: string, id: string) {
      const control = this.productForm.get(controlName);
      control.enable();
      this.productForm.patchValue({
        [controlName]: this.getDropDownArrayByIds(this.crudFiltersList?.[filterKey], id, controlName),
      });
    }

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

    updatesellectedData(key: string, defaultText:string) {
      this.sellectedData[key] = [{name: defaultText}];
    }

    renderConditionalFields(selectedValue: any , crudFiltersList, productForm) {
      const fieldExists = (fieldName: string) => {
        const allFields = [
          ...this.crudFieldConfig.rightSection,
          ...this.crudFieldConfig.lastSection,
          ...this.crudFieldConfig.leftSection
        ];
        console.log(allFields);
        return allFields.some(field => field.name === fieldName);
      };
    
      const baseFields = [
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
    
      const conditionalFields = {
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
    
    // Remove fields from the correct sections (rightSection, lastSection, leftSection)
    const removeFields = (fieldsToRemove: string[]) => {
      fieldsToRemove.forEach(fieldName => {
        // Remove from all relevant sections
        const allSections = [
          this.crudFieldConfig.rightSection,
          this.crudFieldConfig.lastSection,
          this.crudFieldConfig.leftSection
        ];
  
        allSections.forEach(section => {
          const fieldIndex = section.findIndex(field => field.name === fieldName);
          if (fieldIndex !== -1) {
            section.splice(fieldIndex, 1);  // Remove field from section
          }
        });
  
        // Remove from the productForm
        const control = productForm.get(fieldName);
        if (control) {
          control.setValue('');
          control.clearValidators();
          control.updateValueAndValidity();
        }
      });
    };
  
      // Add form control to the correct sections (rightSection, lastSection, leftSection)
      const addFieldControl = (field) => {
        // Add field to all relevant sections
        // const allSections = [
        //   this.crudFieldConfig.rightSection,
        //   this.crudFieldConfig.lastSection,
        //   this.crudFieldConfig.leftSection
        // ];
  
        // allSections.forEach(section => {
        //   if (!section.some(f => f.name === field.name)) {
        //     section.push(field); // Add field to section
        //   }
        // });
  
        // Add field control to the form
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
  
      // Add validators to the form control (rightSection, lastSection, leftSection)
      const addValidators = (controlName: string) => {
        const control = productForm.get(controlName);
        if (control) {
          control.setValidators([Validators.required]);
          control.updateValueAndValidity(); // Re-validate the control
        }
  
        // Add validators to the field in all sections
        const allSections = [
          this.crudFieldConfig.rightSection,
          this.crudFieldConfig.lastSection,
          this.crudFieldConfig.leftSection
        ];
  
        allSections.forEach(section => {
          // const field = section.find(f => f.name === controlName);
          // if (field) {
          //   // You can apply additional logic to add validators to the field if necessary
          // }
        });
      };
  
    
      // Update rightSection, lastSection, and leftSection based on the selected value
      switch (selectedValue) {
        case 'Wine':
          // Add fields to rightSection
          baseFields.forEach(field => {
            if (!fieldExists(field.name)) {
              if (field.isCode) {
                this.crudFieldConfig.lastSection.push(field);
              } else {
                this.crudFieldConfig.rightSection.push(field);
              }
              addFieldControl(field);
              addValidators('sub_type');
              addValidators('category');
              addValidators('source');
              addValidators('country');
              addValidators('vintage');
            }
          });
          conditionalFields.wine.forEach(field => {
            if (!fieldExists(field.name)) {
              this.crudFieldConfig.rightSection.push(field);
              addFieldControl(field);
            }
          });
          break;
        case 'Malt':
          baseFields.forEach(field => {
            if (!fieldExists(field.name)) {
              if (field.isCode) {
                this.crudFieldConfig.lastSection.push(field);
              } else {
                this.crudFieldConfig.rightSection.push(field);
              }
              addFieldControl(field);
            }
          });
          conditionalFields.malt.forEach(field => {
            if (!fieldExists(field.name)) {
              this.crudFieldConfig.rightSection.push(field);
              addFieldControl(field);
            }
          });
          removeFields(['varietal']);
          break;
        case 'Spirits':
          baseFields.forEach(field => {
            if (!fieldExists(field.name)) {
              this.crudFieldConfig.rightSection.push(field);
              addFieldControl(field);
            }
          });
          conditionalFields.spirits.forEach(field => {
            if (!fieldExists(field.name)) {
              this.crudFieldConfig.rightSection.push(field);
              addFieldControl(field);
            }
          });
          break;
        case 'Bulk':
        case 'Other':
          if (!fieldExists('sub_type')) {
            this.crudFieldConfig.rightSection.push(
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
              }
            );
          }
          if (!fieldExists('manufactured_location_address')) {
            this.crudFieldConfig.rightSection.push({
              type: 'text',
              name: 'manufactured_location_address',
              label: 'Manufactured Location Address',
              placeholder: 'Enter Manufactured Location Address'
            });
          }
          removeFields(['vintage', 'varietal', 'category', 'source', 'country', 'abv']);
          break;
        default:
          if (!fieldExists('manufactured_location_address')) {
            this.crudFieldConfig.rightSection.push({
              type: 'text',
              name: 'manufactured_location_address',
              label: 'Manufactured Location Address',
              placeholder: 'Enter Manufactured Location Address'
            });
          }
          break;
      }
    }
}
