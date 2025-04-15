import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleModalService } from 'ngx-simple-modal';
@Component({
    selector: 'app-psi-crud-form',
    templateUrl: './psi-crud-form.component.html',
    styleUrls: ['./psi-crud-form.component.scss']
})
export class PsiCrudFormComponent implements OnInit, OnChanges {

    @Input() leftHeaderTitle: string;
    @Input() headerIconConfig: any;
    @Input() rightHeaderTitle: string;
    @Input() rightHeaderBottomTitle: string;
    @Input() crudFieldConfig: any;
    @Input() sellectedData: any;
    @Input() formSubmitted: boolean;
    @Input() form: any;
    @Output() onDropDownChange = new EventEmitter<any>();
    @Output() formSubmit = new EventEmitter<any>();
    @Output() clearAllClicked: EventEmitter<void> = new EventEmitter<void>();
    @Output() OnChangeDateModel = new EventEmitter<any>();
   
    // @Output() onFileDeleted = new EventEmitter<any>();
    @Input() set shouldClearAllFields(value: boolean) {
        if (value) {
            this.clearAllFields();
        }
    }

    showError: any;
    selectedFiles:any;
    selectedFileCount: number = 0;

    constructor(
        public router: Router,
            private simpleModalService: SimpleModalService,
    ) { }

    ngOnInit(): void {
        this.showError = false
        this.formSubmitted = false
    }

    clearAllSelections(): void {
        const hasValues = [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].some((field) => {
            switch (field.type) {
                case 'multiselect-dropdown':
                case 'text':
                    return this.form?.get(field.name)?.value?.trim() !== '';
                case 'checkbox':
                    return this.form?.get(field.name)?.value === '1';
                default:
                    return false;
            }
        });
        if (!hasValues) { return; }
        this.clearAllClicked.emit();
    }

    clearAllFields(): void {
        if (!this.form || !this.crudFieldConfig) return;
        const clearField = (fieldName: string): void => {
            const control = this.form.get(fieldName);
            if (control) {
                control.setValue('');
                control.markAsPristine();
                control.markAsUntouched();
            }
        };
    
        [...this.crudFieldConfig.leftSection, ...this.crudFieldConfig.rightSection].forEach((field) => {
            switch (field.type) {
                case 'multiselect-dropdown':
                    clearField(field.name);
                    this.sellectedData[field.key] = [];
                    break;
                case 'text':
                case 'checkbox':
                    clearField(field.name);
                    break;
                default:
                    break;
            }
        });
        this.form.updateValueAndValidity();
    }

    /**
     * Responds to changes in data-bound input properties.
     * @param changes
     * @author PSI-Enhancements
     */
    ngOnChanges(changes: SimpleChanges) {
    }

    /**
     * Emits an event when the state of a dropdown changes.
     * @param field
     * @param event
     * @author PSI-Enhancements
     */
    onDropdownStateChange(field, event) {
        this.onDropDownChange.emit({ field, event });
    }

    /**
     * Returns true if the field is invalid and the form has been submitted.
     * @param controlName
     * @returns boolean
     * @author PSI-Enhancements
     */
    isFieldInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return control?.invalid && this.formSubmitted;
    }

    /**
     * Updates the form control value based on the input change.
     *
     * @param field
     * @param value
     * @author PSI-Enhancements
     */
    onInputChange(field, value) {
        this.form.get(field).setValue(value);
    }

    /**
     * Updates the form control value based on the checkbox state.
     *
     * @param field
     * @param isChecked
     * @author PSI-Enhancements
     */
    onCheckedInput(field, isChecked) {
        this.form.get(field)?.setValue(isChecked ? '1' : '0');
    }


    onFileChange(event: any) {
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

      onFileDeleted(): void {
        if (this.selectedFiles.length === 0) {
          this.selectedFileCount = this.selectedFiles.length;
        }
      }

        /**
  *Function to change the file size format.
  * @author PSI-Enhancements
  * @param number
  */
  convertFileSizes(size: any) {
    if (size >= 1024 * 1024) {
      return ((size / (1024 * 1024)).toFixed(2) + ' MB');
    } else {
      return ((size / 1024).toFixed(2) + ' KB');
    }
  }

   /**
  *Function to change the file name format.
  * @author PSI-Enhancements
  * @param string
  */
  convertFileType(fileType: any) {
    const parts = fileType.split('/');
    return parts[1];
  }
}
