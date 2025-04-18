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
    selectedFiles: any[] = [];
    fileFieldMap: { [key: string]: any[] } = {};
    selectedFileCount: number = 0;
    initialFormData: any;
    classification: any[];
    product_type_data: any;
    activeDropdownId: any;

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
        window.removeEventListener('popstate', this.handleBackNavigation);
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', this.handleBackNavigation);
    }

    /**
     * Handle back navigation
     * @author PSI-VIII
     */
    handleBackNavigation = (event: PopStateEvent): void => {
        event.preventDefault();
        history.pushState(null, '', location.href);

        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
            this.formulaForm.value,
            this.filtersList,
            this.edit,
            this.duplicate,
            this.formulaId
        );

        if (JSON.stringify(this.initialFormData) !== JSON.stringify(formattedModel)) {
            const modalData = this.commonService.getModalData(
                'All data will be lost.',
                'Are you sure you wish to exit?'
            );
            this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
                .subscribe((result) => {
                    if (result && result.btn && result.btn.label === 'Yes') {
                        window.removeEventListener('popstate', this.handleBackNavigation);
                        this.router.navigate(['/formula']);
                    }
                });
        } else {
            window.removeEventListener('popstate', this.handleBackNavigation);
            this.router.navigate(['/formula']);
        }
    };

    /**
    * Load dropdown data and initialize form configuration
    * @author PSI-VIII
    */
    loadDropdownData() {
        this.spinner.show();
        const token = this.authService.getToken();
        this.FormulaService.getDropdown(token).then(result => {
            this.filtersList = result;
            this.crudFieldConfig = this.FormulaCrudService.getFormulaFieldConfig(this.filtersList);
            this.initializeForm();
            this.initialFormData = this.getCurrentFormDataSnapshot();
            this.spinner.hide();
        }).catch(error => {
            console.error('Failed to fetch dropdown:', error);
            this.spinner.hide();
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

                if (this.formInitialized) {
                    if (this.duplicate) {
                        delete response.data.formula_id;
                    }
                    this.prefillForm(response.data);
                } else {

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
            lisd_doc: formulaData?.lisd_doc || [],
            fids_doc: formulaData?.fids_doc || [],
            mm_doc: formulaData?.mm_doc || [],
            approved_doc: formulaData?.approved_doc || [],
            date_approved: formulaData.date_approved || '',
            date_expired: formulaData.date_expired || '',
            no_expiration_date: formulaData.no_expiration_date || false
        };

        const setDropdownValue = (fieldName, value) => {
            if (!value) return;

            const options = this.filtersList[fieldName] || [];
            const selectedOption = options.find(opt => opt.id === value);

            if (selectedOption) {
                this.sellectedData[fieldName] = [selectedOption];
                this.formulaForm.get(fieldName)?.setValue(value);
            }
        };

        setDropdownValue('client_id', formulaData.client_id);
        setDropdownValue('formula_status', formulaData.formula_status);
        setDropdownValue('product_type', formulaData.product_type);
        setDropdownValue('classification', formulaData.classification);
        setDropdownValue('sample_received', formulaData.sample_received);
        this.product_type_data = formulaData.product_type;

        const attachmentFields = ['lisd_doc', 'fids_doc', 'mm_doc', 'approved_doc'];
        attachmentFields.forEach(field => {
            if (formulaData[field]) {
                const attachments = Array.isArray(formulaData[field]) ? formulaData[field] : [formulaData[field]];
                if (attachments.length > 0) {
                    this.fileFieldMap[field] = attachments;
                    this.formulaForm.get(field)?.setValue(attachments);
                }
            }
        });

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

    onDropdownStateChange(fieldName: any, selectedValue: any) {
        this.activeDropdownId = selectedValue ? (this.activeDropdownId === selectedValue ? null : selectedValue) : null;
        const idFields = [
            'client_id', 'product_type', 'classification', 'formula_status'
        ];
        if (idFields.includes(fieldName)) {
            this.formulaForm.get(fieldName)?.setValue(selectedValue[0]?.id);
        } else {
            this.formulaForm.get(fieldName)?.setValue(selectedValue[0]?.name);
        }

        switch (fieldName) {
            case 'product_type':
                this.product_type_data = selectedValue[0].name;
                this.fetchClassification();
                break;
        }
    }

    onSubmit(event: string) {
        if (event === "Submit") {
            console.log('Raw form values:', this.formulaForm.getRawValue());
            console.log('Selected data:', this.sellectedData);
            this.formSubmitted = true;
            if (this.formulaForm.valid) {
                const formData = new FormData();
                const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
                    this.formulaForm.value,
                    this.filtersList,
                    this.edit,
                    this.duplicate,
                    this.formulaId
                );
                console.log('Formatted model:', formattedModel);
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

                this.spinner.show();
                const hasFiles = Object.values(this.fileFieldMap || {}).some(files => files && files.length > 0);

                if (hasFiles) {
                    this.FormulaCrudService.saveFormulaWithAttachments(formData, this.edit).subscribe(
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
            const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
                this.formulaForm.value,
                this.filtersList,
                this.edit,
                this.duplicate,
                this.formulaId
            );
            if (JSON.stringify(this.initialFormData) !== JSON.stringify(formattedModel)) {
                this.openConfirmationPopup();
            } else {
                this.router.navigate(['/formula']);
            }
        }
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
                    this.router.navigate(['/formula']);
                }
            });
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
            this.crudFieldConfig.leftSection[5].options = this.classification
            this.crudFieldConfig = { ...this.crudFieldConfig };
            this.changeDetector.detectChanges();
        }
    }

    fetchClassification() {
        const formattedModel = this.FormulaCrudService.formatModelFormulaTool(
            this.formulaForm.value,
            this.filtersList,
            this.edit,
            this.duplicate,
            this.formulaId
        );
        let payload = {
            product_origin: formattedModel.product_origin,
            product_type: this.product_type_data
        }

        this.FormulaCrudService.getClassification(payload).subscribe(response => {
            this.classification = response.data;
            if (this.classification && this.classification.length > 0) {
                this.filtersList['classification'] = this.classification;
                this.changeDetector.detectChanges();
            }
            this.updateClassificationFilter();
        });
    }
}
