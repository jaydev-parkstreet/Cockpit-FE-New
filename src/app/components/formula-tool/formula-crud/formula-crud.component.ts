import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { formulaService } from '../summary.service';
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
    crudFieldConfig: any;
    filtersList: any;
    modalData: any;
    permissions: any;
    sellectedData: any = {};
    duplicate: boolean = false;
    formulaId: any;
    edit: boolean = false;
    formulaForm = this.formBuilder.group({});
    formSubmitted: boolean = false;

    constructor(
        private formulaService: formulaService,
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
        this.permissions = this.route.snapshot.data['permissions'];
        const token = this.authService.getToken();
        this.formulaService.getDropdown(token).then(result => {
            this.filtersList = result;
            this.crudFieldConfig = this.FormulaCrudService.getFormulaFieldConfig(this.filtersList);
          
          }).catch(error => {
            console.error('Failed to fetch dropdown:', error);
          });
        this.leftTitle = 'FORMULA CREATION';
        this.formulaTitle = '';
        
        this.modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');

        if (!this.permissions.permissions.Create) {
            this.router.navigate(['formula']);
        }

        let formulaId = this.route.snapshot.paramMap.get('id');
        this.duplicate = this.route.snapshot.data.isDuplicate || false;
        if (formulaId) {
            this.edit = true;
        }
        else {
            this.edit = false;
        }
        if (formulaId) {
            this.getFormulaData(formulaId);
        }
        this.getFormControl();      
    }

    /**
     * This function fetches formula data based on the formula id.
     * @param formulaId
     * @author PSI-VIII
     */
    async getFormulaData(formulaId: string) {
        this.spinner.show();
        this.formulaService.getDetails(formulaId).then((response: any) => {
            this.spinner.hide();
            if (!response.hasError) {
                this.formulaId = response.data.formula_id;
                setTimeout(() => {
                    if (this.duplicate) {
                        delete response.data.formula_id;
                    }
                    this.prefillForm(response.data);
                }, 100);
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                this.router.navigate(['../']);
            }
        });
    }

    prefillForm(formulaData: any): void {
        this.formulaForm.patchValue({
            name: formulaData.name,
            description: formulaData.description,
            type: this.getDropDownArrayByIds(this.filtersList?.types, formulaData.type, 'type'),
            category: this.getDropDownArrayByIds(this.filtersList?.categories, formulaData.category, 'category'),
            status: formulaData.status,
        });
        this.formulaForm.updateValueAndValidity();
    }

    getDropDownArrayByIds(list: any[], value: any, name: string) {
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
        console.log('Clear All button clicked');
    }
    onDropdownStateChange(field: any, event: any): void {
        console.log('Dropdown state changed:', field, event);
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
                this.FormulaCrudService.saveFormula(formattedModel).subscribe(response => {
                    this.spinner.hide();
                    if (!response.hasError) {
                        const formulaId = response.formula_id;
                        this.commonService.showToastV2Message(true, this.edit ? 'Edited Successfully!' : response.msg, 'fas fa-check-circle', 'success');
                        this.router.navigateByUrl(`/formula/${formulaId}`);
                    } else {
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

    openConfirmationPopup() {
        const modalData = this.commonService.getModalData('All data will be lost.', 'Are you sure you wish to exit?');
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result.btn.label === 'Yes') {
                    this.router.navigate(["/formula"]);
                }
            });
    }

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
        this.formulaForm = new FormGroup(controls);
    }

    trackByField(index: number, field: any): string {
        return field.name;
    }
}
