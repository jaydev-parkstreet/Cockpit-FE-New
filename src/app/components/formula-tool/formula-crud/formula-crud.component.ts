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
import { DatePipe } from '@angular/common';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
@Component({
    selector: 'app-formula-crud',
    templateUrl: './formula-crud.component.html',
    styleUrls: ['./formula-crud.component.scss'],
    providers: [DatePipe],
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
    selectedFiles: any[] = [];
    fileFieldMap: { [key: string]: any[] } = {};
    selectedFileCount: number = 0;
    initialFormData: any;
    classification: any[];
    product_type_data: any;
    activeDropdownId: any;
    selectedFilesMap: { [key: string]: File[] } = {};
    entities: string[] = [];
    form: FormGroup;
    isEditMode: any;
    entityuploads: any;
    initialFormDataSnapshot: any;

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
        private datePipe: DatePipe,
        private commonBackendService: CommonBackendService,
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
        this.isEditMode = !!formulaId && !this.duplicate;
        this.edit = this.isEditMode;

        if (formulaId) {
            this.edit = true;
            this.isEditMode = true
            this.getFormulaData(formulaId);
        } else {
            this.edit = false;
            setTimeout(() => {
                this.initialFormDataSnapshot = this.normalizeFormData(
                    this.FormulaCrudService.formatModelFormulaTool(
                        this.formulaForm.getRawValue(),
                        this.filtersList,
                        this.edit,
                        this.duplicate,
                        this.formulaId
                    )
                );
                console.log('Add mode initial snapshot:', this.initialFormDataSnapshot);
            }, 500);
        }
        window.removeEventListener('popstate', this.handleBackNavigation);
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', this.handleBackNavigation);
        this.form = this.formBuilder.group({
            no_expiration_date: ['0'],
            date_expired: null,
        });
        this.formulaForm.valueChanges.subscribe(values => {
        });
    }

    /**
     * Handle back navigation
     * @author PSI-VIII
     */
    handleBackNavigation = (event: PopStateEvent): void => {
        event.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
            this.formulaForm.getRawValue(),
            this.filtersList,
            this.edit,
            this.duplicate,
            this.formulaId
        );

        const hasUnsavedChanges = JSON.stringify(this.initialFormData) !== JSON.stringify(formattedModel);

        if (hasUnsavedChanges) {
            const modalData = this.commonService.getModalData(
                'All data will be lost.',
                'Are you sure you wish to exit?'
            );
            this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
                .subscribe((result) => {
                    if (result && result.btn && result.btn.label === 'Yes') {
                        window.removeEventListener('popstate', this.handleBackNavigation);
                        history.back();
                    } else {
                        history.pushState(null, '', location.href);
                    }
                });
        } else {
            window.removeEventListener('popstate', this.handleBackNavigation);
            history.back();
        }
    };

    /**
    * Load dropdown data and initialize form configuration
    * @author PSI-VIII
    */
    loadDropdownData() {
        this.commonService.showSpinner();
        const token = this.authService.getToken();
        this.FormulaService.getDropdown(token).then(result => {
            this.filtersList = result;
            this.crudFieldConfig = this.FormulaCrudService.getFormulaFieldConfig(this.filtersList);
            if (!this.edit) {
                this.crudFieldConfig.leftSection = this.crudFieldConfig.leftSection.filter(field => field.key !== 'id');
            }
            this.initializeForm();
            this.initialFormData = this.getCurrentFormDataSnapshot();
            if (!this.isEditMode) {
                this.initialFormData.product_origin = "I";
                this.formulaForm.patchValue({
                    product_origin: 'I'
                });
                setTimeout(() => {
                    this.initialFormDataSnapshot = this.normalizeFormData(
                        this.FormulaCrudService.formatModelFormulaTool(
                            this.formulaForm.getRawValue(),
                            this.filtersList,
                            this.edit,
                            this.duplicate,
                            null
                        )
                    );
                }, 300);
            }
            this.commonService.hideSpinner();
        }).catch(error => {
            console.error('Failed to fetch dropdown:', error);
            this.commonService.hideSpinner();
            this.commonService.showToastV2Message(true, 'Failed to load dropdown data', 'fas fa-exclamation-circle');
        });
    }

    /**
     * Get the current form data snapshot
     * @author PSI-VIII
     * @returns The current form data
     */
    getCurrentFormDataSnapshot(): any {
        const currentRawForm = this.formulaForm.getRawValue();
        const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
            currentRawForm,
            this.filtersList,
            this.edit,
            this.duplicate,
            this.formulaId
        );

        return formattedModel;
    }

    /**
     * Initialize the form with proper controls
     * @author PSI-VIII
     */
    initializeForm() {
        if (!this.crudFieldConfig ||
            !this.crudFieldConfig.rightSection ||
            !this.crudFieldConfig.leftSection) {
            console.error('Field configuration is not properly loaded');
            return;
        }
        if (!this.crudFieldConfig || !this.crudFieldConfig.rightSection || !this.crudFieldConfig.leftSection) {
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
                { value: field.value || null, disabled: isDisabled },
                validators
            );
        });
        this.formulaForm = this.formBuilder.group(formControls);
        this.formInitialized = true;
        this.formulaForm.statusChanges.subscribe(() => {
            this.updateSubmitButtonState();
        });
        this.changeDetector.detectChanges();
    }

    /**
     * This function fetches formula data based on the formula id.
     * @param formulaId
     * @author PSI-VIII
     */
    async getFormulaData(formulaId: string) {
        this.commonService.showSpinner();
        this.FormulaService.getDetails(formulaId).then((response: any) => {
            this.commonService.hideSpinner();
            if (!response.hasError) {
                this.formulaId = response.data.id;
                this.entityuploads = response.data.entity_uploads || [];

                const initializeAndPrefill = () => {
                    if (this.duplicate) {
                        delete response.data.id;
                    }
                    this.prefillForm(response.data);
                    setTimeout(() => {
                        const rawData = this.FormulaCrudService.formatModelFormulaTool(
                            this.formulaForm.getRawValue(),
                            this.filtersList,
                            this.edit,
                            this.duplicate,
                            this.formulaId
                        );

                        this.initialFormDataSnapshot = this.normalizeFormData(rawData);
                    }, 300);
                }

                if (this.formInitialized) {
                    initializeAndPrefill();
                } else {
                    const checkInterval = setInterval(() => {
                        if (this.formInitialized) {
                            clearInterval(checkInterval);
                            initializeAndPrefill();
                        }
                    }, 100);
                }
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                this.router.navigate(['formula']);
            }
        }).catch(error => {
            this.commonService.hideSpinner();
            this.commonService.showToastV2Message(true, 'Failed to fetch formula details', 'fas fa-exclamation-circle');
        });
    }

    /**
    * Handles file uploads for document fields
    * @author PSI-VIII
    * @param event The file change event containing the selected files
    */
    onFileChange(event: any): void {
        const files = event?.target?.files;
        if (!files || files.length === 0) return;
        this.selectedFiles = Array.from(files);
        const activeField = this.currentActiveField;
        if (activeField) {
            this.fileFieldMap[activeField] = this.selectedFiles;
            this.formulaForm.get(activeField)?.setValue(this.selectedFiles);
            this.formulaForm.get(activeField)?.markAsDirty();
        }

        this.changeDetector.detectChanges();
    }
    currentActiveField: string | null = null;

    /**
     * Set the currently active file upload field
     * @author PSI-VIII
     * @param fieldName The name of the field being uploaded to
     */
    setActiveUploadField(fieldName: string): void {
        this.currentActiveField = fieldName;
        if (this.fileFieldMap[fieldName]) {
            this.selectedFiles = this.fileFieldMap[fieldName];
        } else {
            this.selectedFiles = [];
        }

        this.changeDetector.detectChanges();
    }
    private normalizeFormData(data: any): any {
        if (!data) return {};

        const normalized = { ...data };
        Object.keys(normalized).forEach(key => {
            if (normalized[key] === '' || normalized[key] === undefined) {
                normalized[key] = null;
            }
        });
        const dateFields = ['date_requested', 'date_submitted', 'date_approved', 'date_expired'];
        dateFields.forEach(field => {
            if (normalized[field]) {
                try {
                    const date = new Date(normalized[field]);
                    normalized[field] = isNaN(date.getTime()) ? null : date.toISOString();
                } catch {
                    normalized[field] = null;
                }
            }
        });

        return normalized;
    }

    /**
     * Handles file deletion
     * @param index Index of the file to delete
     */
    deleteFile(index: number): void {
        if (index >= 0 && index < this.selectedFiles.length) {
            this.selectedFiles.splice(index, 1);
            if (this.currentActiveField) {
                this.fileFieldMap[this.currentActiveField] = [...this.selectedFiles];
                const control = this.formulaForm.get(this.currentActiveField);
                if (control) {
                    control.setValue(this.selectedFiles.length > 0 ? this.selectedFiles : null);
                    control.markAsDirty();
                }
            }

            this.changeDetector.detectChanges();
        }
    }

    /**
     * Convert file size to readable format
     * @param size File size in bytes
     * @returns Formatted string representing file size
     */
    convertFileSizes(size: number): string {
        if (!size) return '0 B';
        if (size < 1024) return size + ' B';
        else if (size < 1048576) return Math.round(size / 1024) + ' KB';
        else return Math.round(size / 1048576) + ' MB';
    }

    /**
     * Convert file type to a display-friendly format
     * @param type File MIME type
     * @returns File type string
     */
    convertFileType(type: string): string {
        if (!type) return 'Unknown';

        const fileType = type.split('/').pop()?.toUpperCase() || 'Unknown';
        return fileType === 'PDF' ? 'PDF' :
            fileType === 'JPEG' || fileType === 'JPG' ? 'Image' :
                fileType === 'PNG' ? 'Image' :
                    fileType === 'DOCX' || fileType === 'DOC' ? 'Word' :
                        fileType === 'XLSX' || fileType === 'XLS' ? 'Excel' :
                            fileType;
    }

    /**
     * Prefill the form with existing formula data
     * @author PSI-VIII
     * @param formulaData The formula data to prefill
     */
    prefillForm(formulaData: any): void {
        if (!this.formulaForm || Object.keys(this.formulaForm.controls).length === 0) {
            console.warn('Form not ready for prefilling, will retry');
            setTimeout(() => this.prefillForm(formulaData), 100);
            return;
        }
        const normalizedData = this.normalizeFormData(formulaData);
        const formData = {
            ...normalizedData,
            name: formulaData.name || '',
            id: formulaData.id || '',
            description: formulaData.description || '',
            formula_description: formulaData.formula_description || '',
            formula_status: formulaData.formula_status_id || '',
            product_origin: formulaData.product_origin || 'I',
            submission_id: formulaData.submission_id || '',
            formula_id: formulaData.formula_id || '',
            client_name: formulaData.client_name || '',
            client_id: formulaData.client_id || null,
            classification: formulaData.classification || null,
            product_type: formulaData.product_type || null,
            sample_received: this.getDropDownArrayByIds(this.filtersList?.sample_received, formulaData.sample_received, 'sample_received'),
            type: this.getDropDownArrayByIds(this.filtersList?.types, formulaData.type, 'type'),
            category: this.getDropDownArrayByIds(this.filtersList?.categories, formulaData.category, 'category'),
            status: formulaData.status || '',
            date_requested: formulaData.date_requested || '',
            commodity_statement: formulaData.commodity_statement || '',
            commodity_statement_request: formulaData.commodity_statement_request || '',
            total_batch_size: formulaData.total_batch_size || '',
            batch_size_unit_of_measure: formulaData.batch_size_unit_of_measure || '',
            notes: formulaData.notes || '',
            date_submitted: formulaData.date_submitted || '',
            formula_loi_id: formulaData?.formula_loi_id || [],
            formula_fids_id: formulaData?.formula_fids_id || [],
            formula_mom_id: formulaData?.formula_mom_id || [],
            formula_approval_id: formulaData?.formula_approval_id || [],
            date_approved: formulaData.date_approved || '',
            date_expired: formulaData.date_expired || '',
            no_expiration_date: formulaData.no_expiration_date || false,
        };

        this.formulaForm.patchValue(formData);

        const setClientValue = (fieldName, value) => {
            if (!value) return;

            const options = this.filtersList[fieldName] || [];
            const selectedOption = options.find(opt => opt.quickbooks_id === value);

            if (selectedOption) {
                this.sellectedData[fieldName] = [selectedOption];
                this.formulaForm.get(fieldName)?.setValue(selectedOption.quickbooks_id);
                this.formulaForm.get(fieldName)?.markAsTouched();
                this.formulaForm.get(fieldName)?.updateValueAndValidity();
            } else {
                this.formulaForm.get(fieldName)?.setValue('');
            }
            this.updateSubmitButtonState();
            this.changeDetector.detectChanges();
        };

        const setDropdownValue = (fieldName, value) => {
            if (!value) return;

            const options = this.filtersList[fieldName] || [];
            const selectedOption = options.find(opt => opt.id === value);

            if (selectedOption) {
                this.sellectedData[fieldName] = [selectedOption];
                this.formulaForm.get(fieldName)?.setValue(value);
            }
            this.updateSubmitButtonState();
        };
        const entityKindMap = {
            formula_loi_id: this.filtersList.entity_kinds[3].id,
            formula_fids_id: this.filtersList.entity_kinds[1].id,
            formula_mom_id: this.filtersList.entity_kinds[2].id,
            formula_approval_id: this.filtersList.entity_kinds[0].id
        };

        if (this.isEditMode && Array.isArray(this.entityuploads) && this.entityuploads.length > 0) {
            this.crudFieldConfig.rightSection.forEach(field => {
                if (field.type === 'upload-attachment' && entityKindMap[field.name]) {
                    const matchingFiles = this.entityuploads.filter(upload => upload.entity_kind === entityKindMap[field.name]);
                    if (matchingFiles.length > 0) {
                        field.selectedFileUrls = matchingFiles;
                        field['isEditMode'] = true;
                    }
                }
            });
        }

        setClientValue('client_id', formulaData.client_id);
        setDropdownValue('formula_status', formulaData.formula_status_id);
        setDropdownValue('product_type', formulaData.product_type);
        setDropdownValue('sample_received', formulaData.sample_received);
        this.product_type_data = formulaData.product_type;
        this.fetchClassification(formulaData.classification);

        if (this.isEditMode && !this.duplicate) {
            this.formulaForm.get('date_requested')?.disable();
            const dateRequestedField = this.crudFieldConfig.leftSection.find(f => f.key === 'date_requested' || f.name === 'date_requested');
            if (dateRequestedField) {
                dateRequestedField.disabled = true;
                dateRequestedField.isDisabled = true;
            }
        }

        if (this.isEditMode && !this.duplicate) {
            this.formulaForm.get('client_id')?.disable();
            const clientIdField = this.crudFieldConfig.leftSection.find(f => f.key === 'client_id' || f.name === 'client_id');
            if (clientIdField) {
                clientIdField.disabled = true;
                clientIdField.isDisabled = true;
            }
        }

        this.formulaForm.updateValueAndValidity();
        this.updateSubmitButtonState();
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
        this.updateSubmitButtonState();
        this.changeDetector.detectChanges();
    }
    /**
     * Update the state of the submit button based on form validity
     * @author PSI-VIII
     */
    updateSubmitButtonState(): void {
        const formValid = this.formulaForm.valid;
        const requiredFieldKeysRightSection = ['date_approved', 'date_expired'];
        const requiredFieldsValidRightSection = requiredFieldKeysRightSection.every(key => {
            const field = this.crudFieldConfig.rightSection.find(f => f.key === key);
            const control = this.formulaForm.get(key);

            if (key === 'date_expired' && this.form.get('no_expiration_date')?.value === '1') {
                return true;
            }

            if (!field?.isRequired) return true;
            return !!control?.value;
        });

        const requiredFieldKeysLeftSection = ['formula_description', 'product_origin', 'date_submitted'];
        const requiredFieldsValidLeftSection = requiredFieldKeysLeftSection.every(key => {
            const field = this.crudFieldConfig.leftSection.find(f => f.key === key);
            const control = this.formulaForm.get(key);
            if (!field?.isRequired) return true;
            return !!control?.value;
        });

        const submitButton = this.crudFieldConfig?.btnLabel?.find(btn => btn.label === 'Submit');
        if (submitButton) {
            submitButton.isDisable = !(formValid && requiredFieldsValidRightSection && requiredFieldsValidLeftSection);
            this.changeDetector.detectChanges();
        }
    }

    onDateModelChange(event: any) {
        this.formulaForm.get(event.type)?.setValue(this.datePipe.transform(event.value, 'yyyy/MM/dd'));
    }

    onDropdownStateChange(fieldName: any, selectedValue: any) {
        this.activeDropdownId = selectedValue ? (this.activeDropdownId === selectedValue ? null : selectedValue) : null;
        const selectedItem = selectedValue[0];
        const idFields = [
            'product_type', 'classification', 'formula_status'
        ];
        const clients = ['client_id']
        if (idFields.includes(fieldName)) {
            this.formulaForm.get(fieldName)?.setValue(selectedValue[0]?.id);
        } else if (clients.includes(fieldName)) {
            this.formulaForm.get(fieldName)?.setValue(selectedValue[0]?.quickbooks_id);
        } else {
            this.formulaForm.get(fieldName)?.setValue(selectedValue[0]?.name);
        }
        switch (fieldName) {
            case 'product_type':
                this.product_type_data = selectedValue[0].name;
                this.fetchClassification();
                break;
            case 'classification':
                if (selectedValue[0].formula_required === 'N') {
                    this.openClassificationPopup();
                    const submitButton = this.crudFieldConfig?.btnLabel?.find(btn => btn.label === 'Submit');
                    if (submitButton) {
                        submitButton.isDisable = true;
                        this.changeDetector.detectChanges();
                    } else {
                        this.updateSubmitButtonState();
                    }
                }
                break;
            case 'formula_status':
                const fieldsToUpdate = ['date_expired', 'date_approved', 'formula_approval_id'];
                if (Array.isArray(this.crudFieldConfig.rightSection)) {
                    fieldsToUpdate.forEach(fieldKey => {
                        const field = this.crudFieldConfig.rightSection.find(f => f.key === fieldKey);
                        if (field) {
                            field.isRequired = selectedValue[0].id === 2;
                        }
                    });
                }
                const isFiled = selectedValue[0].id === 3;
                const dateSubmittedField = this.crudFieldConfig.leftSection.find(f => f.key === 'date_submitted');
                const dateSubmittedControl = this.formulaForm.get('date_submitted');

                if (dateSubmittedField && dateSubmittedControl) {
                    dateSubmittedField.isRequired = isFiled;

                    if (isFiled) {
                        dateSubmittedControl.setValidators([Validators.required]);
                    } else {
                        dateSubmittedControl.clearValidators();
                    }
                    dateSubmittedControl.updateValueAndValidity();
                }

                this.updateSubmitButtonState();
                break;
        }
    }
    private safeCompare(a: any, b: any): boolean {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (this.isDateString(a) || this.isDateString(b)) {
            return new Date(a).getTime() === new Date(b).getTime();
        }
        return a === b;
    }

    private isDateString(value: any): boolean {
        if (typeof value !== 'string') return false;
        return !isNaN(Date.parse(value));
    }
    /**
     * Handles form submission
     * @author PSI-VIII
     * @param event The event triggered by the submit button
     */
    onSubmit(event: string) {
        if (event === "Submit") {
            this.formSubmitted = true;
            if (this.formulaForm.valid) {
                const formData = new FormData();
                const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
                    this.formulaForm.getRawValue(),
                    this.filtersList,
                    this.edit,
                    this.duplicate,
                    this.formulaId
                );
                formData.append('formulaData', JSON.stringify(formattedModel));
                Object.keys(this.fileFieldMap || {}).forEach(fieldName => {
                    const files = this.fileFieldMap[fieldName];
                    if (files && files.length > 0) {
                        files.forEach((file, index) => {
                            if (file instanceof File) {
                                formData.append(`${fieldName}[${index}]`, file, file.name);
                            } else if (file.file_name || file.path || file.url) {
                                formattedModel.existingFiles = formattedModel.existingFiles || {};
                                formattedModel.existingFiles[fieldName] = formattedModel.existingFiles[fieldName] || [];
                                formattedModel.existingFiles[fieldName].push(file);
                            }
                        });
                    }
                });

                formData.delete('formulaData');
                formData.append('formulaData', JSON.stringify(formattedModel));

                this.commonService.showSpinner();
                const hasFiles = Object.values(this.fileFieldMap || {}).some(files => files && files.length > 0);

                if (hasFiles) {
                    this.FormulaCrudService.saveFormulaWithAttachments(formData, this.edit).subscribe(
                        response => {
                            this.commonService.hideSpinner();
                            if (!response.hasError) {
                                this.commonService.showToastV2Message(
                                    true,
                                    this.edit ? 'Saved Successfully' : 'Saved Successfully',
                                    'fas fa-check-circle',
                                    'success'
                                );
                                this.router.navigateByUrl(`/formula`);
                            } else {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                                this.router.navigateByUrl(`/formula`);
                            }
                        },
                        error => {
                            this.commonService.hideSpinner();
                            this.commonService.showToastV2Message(true, "Error saving formula", 'fas fa-exclamation-circle');
                        }
                    );
                } else {
                    this.FormulaCrudService.saveFormula(formattedModel).subscribe(
                        response => {
                            this.commonService.hideSpinner();
                            if (!response.hasError) {
                                this.commonService.showToastV2Message(
                                    true,
                                    this.edit ? 'Saved Successfully' : 'Saved Successfully',
                                    'fas fa-check-circle',
                                    'success'
                                );
                                this.router.navigateByUrl(`/formula`);
                            } else {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                                this.router.navigateByUrl(`/formula`);
                            }
                        },
                        error => {
                            this.commonService.hideSpinner();
                            this.commonService.showToastV2Message(true, "Error saving formula", 'fas fa-exclamation-circle');
                        }
                    );
                }
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
            const currentFormData = this.normalizeFormData(
                this.FormulaCrudService.formatModelFormulaTool(
                    this.formulaForm.getRawValue(),
                    this.filtersList,
                    this.edit,
                    this.duplicate,
                    this.formulaId
                )
            );
            if (!this.isEditMode) {
                const hasUserInput = Object.keys(currentFormData).some(key => {
                    const value = currentFormData[key];
                    if (key === 'product_origin' && value === 'I') return false;
                    if (key === 'no_expiration_date' && value === false) return false;
                    return value !== null && value !== '' && value !== undefined &&
                        (!Array.isArray(value) || value.length > 0);
                });
                if (hasUserInput) {
                    this.openConfirmationPopup();
                } else {
                    this.navigateAway();
                }
            }
            else {
                const differences = this.findDifferences(currentFormData, this.initialFormDataSnapshot);
                if (Object.keys(differences).length > 0) {
                    this.openConfirmationPopup();
                } else {
                    this.navigateAway();
                }
            }
        }
    }
    /**
     * Check if the form is pristine (no changes made)
     * @author PSI-VIII
     * @returns True if the form is pristine, false otherwise
     */
    private isFormPristine(): boolean {
        if (!this.initialFormDataSnapshot) return true;

        const currentData = this.normalizeFormData(
            this.FormulaCrudService.formatModelFormulaTool(
                this.formulaForm.getRawValue(),
                this.filtersList,
                this.edit,
                this.duplicate,
                this.formulaId
            )
        );
        const ignoreFields = ['id', 'date_created', 'last_updated'];

        return Object.keys(currentData).every(key => {
            if (ignoreFields.includes(key)) return true;
            return this.safeCompare(currentData[key], this.initialFormDataSnapshot[key]);
        });
    }
    private navigateAway() {
        if (this.isEditMode) {
            this.router.navigateByUrl(`/formula/${this.formulaId}`);
        } else {
            this.router.navigate(['/formula']);
        }
    }
    private deepEqual(obj1: any, obj2: any): boolean {
        if (obj1 === obj2) return true;

        if (typeof obj1 !== 'object' || obj1 === null ||
            typeof obj2 !== 'object' || obj2 === null) {
            return false;
        }

        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (const key of keys1) {
            if (!keys2.includes(key)) return false;

            if (key === 'existingFiles') continue;

            if (!this.deepEqual(obj1[key], obj2[key])) return false;
        }

        return true;
    }
    private findDifferences(current: any, initial: any): any {
        const diffs: any = {};
        const allKeys = new Set([...Object.keys(current), ...Object.keys(initial)]);

        allKeys.forEach(key => {
            if (!this.deepEqual(current[key], initial[key])) {
                diffs[key] = {
                    current: current[key],
                    initial: initial[key]
                };
            }
        });

        return diffs;
    }
    /**
     * Open confirmation popup before navigating away
     * @author PSI-VIII
     * @param triggeredByBrowserBack Indicates if the navigation was triggered by the browser back button
     */
    openConfirmationPopup(): void {
        const modalData = this.commonService.getModalData(
            'All data will be lost.',
            'Are you sure you wish to exit?'
        );
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result && result.btn && result.btn.label === 'Yes') {
                    window.removeEventListener('popstate', this.handleBackNavigation);
                    if (this.isEditMode) {
                        this.router.navigateByUrl(`/formula/${this.formulaId}`);
                    } else {
                        this.router.navigate(['/formula']);
                    }
                }
            });
    }

    /**
     * The function `openClassificationPopup` displays a modal popup with a specific message for classification
     * @author PSI-VIII
     * @return void
     */
    openClassificationPopup(): void {
        const modalData = {
            title: 'Please note this Classification (Product Type) does not require a formula.',
            body: 'Please select another classification or go back to the Summary page.',
            iconClass: 'fas fa-exclamation-circle error',
            showLine: true,
            btnLabel: [
                { type: 'Btn', label: 'Ok', class: 'secondary' },
            ],
        };
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData });
    }

    ngOnDestroy(): void {
        window.removeEventListener('popstate', this.handleBackNavigation);
    }

    onFileDeleted(): void {
        if (this.currentActiveField) {
            this.fileFieldMap[this.currentActiveField] = [];
            this.selectedFiles = [];
            const control = this.formulaForm.get(this.currentActiveField);
            if (control) {
                control.setValue(null);
                control.markAsDirty();
            }

            this.changeDetector.detectChanges();
        }
    }

    /**
     * Track by function for ngFor to optimize rendering
     * @author PSI-VIII
     * @param index Index of the item
     * @param field The item being tracked
     * @returns Unique identifier for the item
     */
    trackByField(index: number, field: any): string {
        return field?.name || index.toString();
    }

    /**
     * Function to handle file upload for attachments
     * @author PSI-VIII
     * @param event The file change event containing the selected files
     */
    onAttachmentUpload(event: any) {
        const files: FileList = event.target.files;
        const allowedExtensions = ['gif', 'jpeg', 'jpg', 'tiff', 'tif', 'zip', 'pdf', 'msi', 'png'];
        const maxSize = 10 * 1024 * 1024;
        const validFiles: File[] = [];
        if (files.length > 5) {
            alert('Only 5 files are allowed to be uploaded.');
            return;
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = file.name;
            const fileSize = file.size;
            const fileExtension = fileName.split('.').pop()?.toLowerCase();

            if (fileSize > maxSize) {
                alert(`${fileName} is too large! Please upload file up to 10 MB.`)
                return;
            }

            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                alert(`Only ${allowedExtensions.join(', ')} are allowed to be uploaded.`)
                return;
            }
            validFiles.push(file);
        }
        this.selectedFiles = validFiles;
        this.selectedFileCount = this.selectedFiles.length;
        event.target.value = '';
    }

    updateClassificationFilter() {
        if (this.classification && this.classification.length > 0) {
            this.filtersList['classification'] = this.classification;
            const classificationField = this.crudFieldConfig.leftSection.find(field => field.key === 'classification');
            if (classificationField) {
                classificationField.options = this.classification;
            }
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }

    /**
     * The `fetchClassification` function in TypeScript fetches classification data based on a payload
     * and updates the classification filter.
     * @author PSI-VIII
     * @param {any} [selectedClassification] 
     */
    fetchClassification(selectedClassification?: any) {
        const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
            this.formulaForm.value,
            this.filtersList,
            this.edit,
            this.duplicate,
            this.formulaId
        );
        const product_origin = formattedModel.product_origin?.trim()
            ? formattedModel.product_origin
            : this.initialFormData.product_origin;
        let payload = {
            product_origin,
            product_type: this.product_type_data
        }
        this.FormulaCrudService.getClassification(payload).subscribe(response => {
            this.classification = response.data;
            if (this.classification && this.classification.length > 0) {
                this.filtersList['classification'] = this.classification;
                this.changeDetector.detectChanges();
            }
            this.updateClassificationFilter();
            if (selectedClassification) {
                const selectedOption = this.classification.find(opt => opt.id === selectedClassification);
                if (selectedOption) {
                    this.sellectedData['classification'] = [selectedOption];
                    this.formulaForm.get('classification')?.setValue(selectedClassification);
                }
            }
        });
    }

    /**
     * The function `uploadFiles` uploads multiple files with specified type and field name using
     * FormData in TypeScript.
     * @author PSI-VIII
     * @param {File[]} files
     * @param type: string
     * @param fieldName: string 
     */
    uploadFiles(files: File[], type: string, fieldName: string): void {
        this.entities = ['temp' + Date.now()];
        const formData = new FormData();

        files.forEach((file, i) => {
            formData.append(`file[${i}]`, file);
        });

        const kindMap = {
            'Fidsdoc': this.filtersList.entity_kinds[1].id,
            'Lisddoc': this.filtersList.entity_kinds[3].id,
            'Mmdoc': this.filtersList.entity_kinds[2].id,
            'Appdoc': this.filtersList.entity_kinds[0]?.id || null,
        };

        formData.append('tool', this.filtersList.tool_id);
        formData.append('kind', kindMap[type]);
        formData.append('permission_id', this.filtersList.entity_permissions[0].id);
        formData.append('entities', JSON.stringify(this.entities));
        formData.append('menu_item_id', this.filtersList.menu_item_id);

        this.commonService.showSpinner();

        this.commonService.uploadMultipleAttachments(formData).subscribe(
            (response: any) => {
                this.commonService.hideSpinner();
                if (!response.hasError) {
                    this.getUploadsList(type as 'Fidsdoc' | 'Lisddoc' | 'Mmdoc' | 'Appdoc');
                    this.commonService.showToastV2Message(true, 'Uploaded Successfully', 'fas fa-exclamation-circle', 'success');
                } else {
                    this.commonService.showToastV2Message(true, 'Failed', 'saved-footer');
                }
            },
            () => {
                this.commonService.hideSpinner();
                this.commonService.showToastV2Message(true, 'Failed', 'saved-footer');
            }
        );
    }

    /**
     * The function `getUploadsList` retrieves uploaded documents based on the specified type and
     * updates the formula form accordingly.
     * @author PSI-VIII
     * @param {'Fidsdoc' | 'Lisddoc' | 'Mmdoc' | 'Appdoc'} type - The `getUploadsList` function takes a
     * parameter `type` which can have one of the following values: 'Fidsdoc', 'Lisddoc', 'Mmdoc', or
     * 'Appdoc'.
     */
    getUploadsList(type: 'Fidsdoc' | 'Lisddoc' | 'Mmdoc' | 'Appdoc') {
        const tool_id = this.filtersList.tool_id;
        const entity = this.entities[0];
        let kindId: string | null = null;
        if (type === 'Fidsdoc') {
            kindId = this.filtersList.entity_kinds[1].id;
        } else if (type === 'Lisddoc') {
            kindId = this.filtersList.entity_kinds[3].id;
        } else if (type === 'Mmdoc') {
            kindId = this.filtersList.entity_kinds[2].id;
        } else if (type === 'Appdoc') {
            kindId = this.filtersList.entity_kinds[0].id;
        }

        this.commonBackendService.getAttachments(entity, tool_id).subscribe((response: any) => {
            const uploadedDocs = response.data;
            uploadedDocs[0].entity_id = this.entities[0];

            const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
                this.formulaForm.getRawValue(),
                this.filtersList,
                this.edit,
                this.duplicate,
                this.formulaId
            );

            if (type === 'Fidsdoc') {
                formattedModel.formula_fids_id = this.entities[0];
            } else if (type === 'Lisddoc') {
                formattedModel.formula_loi_id = this.entities[0];
            } else if (type === 'Mmdoc') {
                formattedModel.formula_mom_id = this.entities[0];
            } else if (type === 'Appdoc') {
                formattedModel.formula_approval_id = this.entities[0];
            }
            this.formulaForm.patchValue(formattedModel);
        }, () => {
            this.commonService.showToastV2Message(true, 'Failed to fetch uploaded files', 'saved-footer');
        });
    }

    /**
     * The function `onCheckedInput` updates form controls based on the checked status of a field, with
     * special handling for a field related to expiration dates.
     * @author PSI-VIII
     * @param data { field: string, isChecked: boolean }
     */
    onCheckedInput(data: { field: string, isChecked: boolean }): void {
        const { field, isChecked } = data;
        const control = this.form.get(field);
        if (control) {
            control.setValue(isChecked ? '1' : '0');
        }

        if (field === 'no_expiration_date') {
            const dateExpiredControl = this.formulaForm.get('date_expired');
            if (dateExpiredControl) {
                dateExpiredControl.setValue(null);
                isChecked ? dateExpiredControl.disable() : dateExpiredControl.enable();

                const formulaStatus = this.formulaForm.get('formula_status')?.value;
                const isApproved = formulaStatus === '2';

                if (isChecked) {
                    dateExpiredControl.clearValidators();
                } else if (isApproved) {
                    dateExpiredControl.setValidators([Validators.required]);
                }
                dateExpiredControl.updateValueAndValidity();
            }
            if (Array.isArray(this.crudFieldConfig.rightSection)) {
                const dateExpiredField = this.crudFieldConfig.rightSection.find(f => f.key === 'date_expired');
                if (dateExpiredField) {
                    dateExpiredField.isDisabled = isChecked;
                    const formulaStatus = this.formulaForm.get('formula_status')?.value;
                    dateExpiredField.isRequired = !isChecked && formulaStatus === '2';
                }
            }
            this.updateSubmitButtonState();
        }
    }
}
