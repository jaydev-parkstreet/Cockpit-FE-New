import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormulaService } from '../formula.service';
import { FormulaCrudService } from './formula-crud.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SimpleModalService } from 'ngx-simple-modal';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';
import { AuthService } from '../../authentication/auth.service';
@Component({
    selector: 'app-formula-crud',
    templateUrl: './formula-crud.component.html',
    styleUrls: ['./formula-crud.component.scss'],
})
export class FormulaCrudComponent implements OnInit {
    @Output() updateFilters = new EventEmitter<any>();

    leftTitle: string;
    formulaTitle: string;
    crudFieldConfig: any = {
        leftSection: [],
        rightSection: [],
        btnLabel: []
    };
    filtersList: any;
    modalData: any;
    permissions: any;
    sellectedData: any = {};
    duplicate: boolean = false;
    formulaId: any;
    edit: boolean = false;
    formulaForm = this.formBuilder.group({});
    formSubmitted: boolean = false;
    formInitialized: boolean = false;

    constructor(
        private FormulaService: FormulaService,
        private FormulaCrudService: FormulaCrudService,
        private changeDetector: ChangeDetectorRef,
        public router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private commonService: CommonService,
        private simpleModalService: SimpleModalService,
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        this.leftTitle = 'FORMULA CREATION';
        this.formulaTitle = '';
        this.modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');

        this.permissions = this.route.snapshot.data['permissions'];
        if (!this.permissions.permissions.Create) {
            this.router.navigate(['formula']);
            return;
        }
        this.loadDropdownData();
        
        let formulaId = this.route.snapshot.paramMap.get('id');
        this.duplicate = this.route.snapshot.data.isDuplicate || false;
        
        if (formulaId) {
            this.edit = true;
            this.getFormulaData(formulaId);
        } else {
            this.edit = false;
        }
    }
  /**
     * Load dropdown data and initialize form configuration
     */
  loadDropdownData() {
    this.spinner.show();
    const token = this.authService.getToken();
    this.FormulaService.getDropdown(token).then(result => {
        this.filtersList = result;
        this.crudFieldConfig = this.FormulaCrudService.getFormulaFieldConfig(this.filtersList);
        this.initializeForm();
        this.spinner.hide();
    }).catch(error => {
        console.error('Failed to fetch dropdown:', error);
        this.spinner.hide();
        this.commonService.showToastV2Message(true, 'Failed to load dropdown data', 'fas fa-exclamation-circle');
    });
}
 /**
     * Initialize the form with proper controls
     */
 initializeForm() {
    if (!this.crudFieldConfig || 
        !this.crudFieldConfig.rightSection || 
        !this.crudFieldConfig.leftSection) {
        console.error('Field configuration is not properly loaded');
        return;
    }
    
    const formControls = {};
    const allFields = [
        ...this.crudFieldConfig.rightSection,
        ...this.crudFieldConfig.leftSection
    ];
    
    allFields.forEach(field => {
        if (!field || !field.name) {
            console.error('Invalid field configuration:', field);
            return;
        }
        
        const isDisabled = field.isDisabled || false;
        const isFieldRequired = field.required || field.isRequired;
        const validators = isFieldRequired ? [Validators.required] : [];
        
        formControls[field.name] = new FormControl(
            { value: '', disabled: isDisabled },
            validators
        );
    });
    
    this.formulaForm = this.formBuilder.group(formControls);
    this.formInitialized = true;
    this.changeDetector.detectChanges();
}
    /**
     * This function fetches formula data based on the formula id.
     * @param formulaId
     * @author PSI-VIII
     */
    async getFormulaData(formulaId: string) {
        this.spinner.show();
        this.FormulaService.getDetails(formulaId).then((response: any) => {
            this.spinner.hide();
            if (!response.hasError) {
                this.formulaId = response.data.formula_id;
                
                // Wait for form to be initialized before filling it
                if (this.formInitialized) {
                    if (this.duplicate) {
                        delete response.data.formula_id;
                    }
                    this.prefillForm(response.data);
                } else {
                    // Poll for form initialization
                    const checkInterval = setInterval(() => {
                        if (this.formInitialized) {
                            clearInterval(checkInterval);
                            if (this.duplicate) {
                                delete response.data.formula_id;
                            }
                            this.prefillForm(response.data);
                        }
                    }, 100);
                }
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                this.router.navigate(['formula']);
            }
        }).catch(error => {
            this.spinner.hide();
            this.commonService.showToastV2Message(true, 'Failed to fetch formula details', 'fas fa-exclamation-circle');
        });
    }

    prefillForm(formulaData: any): void {
        if (!this.formulaForm || Object.keys(this.formulaForm.controls).length === 0) {
            console.warn('Form not ready for prefilling, will retry');
            setTimeout(() => this.prefillForm(formulaData), 100);
            return;
        }
        
        const formData = {
            name: formulaData.name || '',
            description: formulaData.description || '',
            formula_description: formulaData.formula_description || '',
            formula_status: formulaData.formula_status || '',
            product_origin: formulaData.product_origin || '',
            product_type: formulaData.product_type || '',
            classification: formulaData.classification || '',
            submission_id: formulaData.submission_id || '',
            formula_id: formulaData.formula_id || '',
            client_name: formulaData.client_name || '',
            client_id: this.getDropDownArrayByIds(this.filtersList?.client_id, formulaData.client_id, 'client_id'),
            type: this.getDropDownArrayByIds(this.filtersList?.types, formulaData.type, 'type'),
            category: this.getDropDownArrayByIds(this.filtersList?.categories, formulaData.category, 'category'),
            status: formulaData.status || '',
            date_requested: formulaData.date_requested || '',
            commodity_statement: formulaData.commodity_statement || '',
            composition: formulaData.composition || '',
            total_batch_size: formulaData.total_batch_size || '',
            batch_size_unit_of_measure: formulaData.batch_size_unit_of_measure || '',
            notes: formulaData.notes || '',
            sample_received: formulaData.sample_received || '',
            date_submitted: formulaData.date_submitted || '',
            lisd_doc: formulaData.lisd_doc || '',
            fids_doc: formulaData.fids_doc || [],
            mm_doc: formulaData.mm_doc || [],
            approved_doc: formulaData.approved_doc || '',
            date_approved: formulaData.date_approved || '',
            date_expired: formulaData.date_expired || '',
            no_expiration_date: formulaData.no_expiration_date || false
        };

        this.formulaForm.patchValue(formData);
        this.formulaForm.updateValueAndValidity();
        this.changeDetector.detectChanges();
    }

    getDropDownArrayByIds(list: any[], value: any, name: string) {
        if (!list || !value) return null;
        
        let result = [];
        for (let i = 0; i < list?.length; i++) {
            if (list[i].id == value) {
                result.push(list[i]);
                this.sellectedData[name] = result;
                return result;
            }
        }
        return result.length === 0 ? null : result;
    }

    onClearAllClicked(): void {
        this.formulaForm.reset();
        this.sellectedData = {};
        this.changeDetector.detectChanges();
    }
    
    onDropdownStateChange(field: any, event: any): void {
        if (field && event) {
            this.sellectedData[field.name] = event;
            this.changeDetector.detectChanges();
        }
    }

    onSubmit(event: string) {
        if (event === "Submit") {
            this.formSubmitted = true;
            if (this.formulaForm.valid) {
                const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
                    this.formulaForm.value,
                    this.filtersList,
                    this.edit,
                    this.duplicate,
                    this.formulaId
                );
                this.spinner.show();
                this.FormulaCrudService.saveFormula(formattedModel).subscribe(
                    response => {
                        this.spinner.hide();
                        if (!response.hasError) {
                            const formulaId = response.formula_id;
                            this.commonService.showToastV2Message(
                                true, 
                                this.edit ? 'Formula edited successfully!' : response.msg, 
                                'fas fa-check-circle', 
                                'success'
                            );
                            this.router.navigateByUrl(`/formula/${formulaId}`);
                        } else {
                            this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                        }
                    },
                    error => {
                        this.spinner.hide();
                        this.commonService.showToastV2Message(true, "Error saving formula", 'fas fa-exclamation-circle');
                    }
                );
            } else {
                const invalidFields = [];
                Object.keys(this.formulaForm.controls).forEach(key => {
                  const control = this.formulaForm.get(key);
                  if (control && control.invalid) {
                    invalidFields.push(key);
                  }
                });
                console.error('Invalid fields:', invalidFields);
                this.commonService.showToastV2Message(true, "Please fill all required fields", 'fas fa-exclamation-circle');
            }
        } else {
            this.openConfirmationPopup();
        }
    }

    openConfirmationPopup() {
        const modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result && result.btn && result.btn.label === 'Yes') {
                    this.router.navigate(["/formula"]);
                }
            });
    }

    trackByField(index: number, field: any): string {
        return field?.name || index.toString();
    }
}
