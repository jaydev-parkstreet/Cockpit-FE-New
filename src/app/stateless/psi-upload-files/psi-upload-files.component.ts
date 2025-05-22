import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
    selector: 'app-psi-upload-files',
    templateUrl: './psi-upload-files.component.html',
    styleUrls: ['./psi-upload-files.component.scss']
})
export class PsiUploadFilesComponent implements OnInit {
    @Input() configUpload: any;
    @Input() placeholder: string;
    @Input() validationClasses: any;
    @Output() changeFileUpload = new EventEmitter<any>();
    selectedFileCount: number;
    selectedFiles: File[] = [];
    errorMessage: string = '';
    @Input() isEditMode: boolean = false;
    @Input() isUploadMode: boolean = false;
    @Input() selectedFileUrls: any[] = [];
    @Input() uploadFileUrls: any[] = [];
    @Output() fileDeleted = new EventEmitter<void>();

    constructor(
        private commonBackendService: CommonBackendService,
        private commonService: CommonService
    ) { }

    ngOnInit(): void {
    }

    /**
     * Function to call on file upload.
     * @param event
     * @author PSI-Enhancements
     */
    onFileChange(event: any): void {
        const files: FileList = event.target.files;
        const allowedExtensions = this.configUpload?.allowedExtensions || ['gif', 'jpeg', 'jpg', 'tiff', 'tif', 'zip', 'pdf', 'msi', 'png'];
        const maxSize = 10 * 1024 * 1024;
        const validFiles: File[] = this.selectedFiles;

        if (this.configUpload?.isShowUploader) {
            this.handleFileUpload(files, allowedExtensions, maxSize, event, validFiles);
        } else {
            this.handleMassExcelFileUpload(files, allowedExtensions, maxSize, event, validFiles);
        }

        event.target.value = '';
        this.changeFileUpload.emit(this.selectedFiles);
    }

    /**
     *Function to check file valid or not.
     * @author PSI-Enhancements
     * @param files
     * @param allowedExtensions
     * @param maxSize
     * @param event
     * @param validFiles 
     */
    handleMassExcelFileUpload(files: FileList, allowedExtensions: string[], maxSize: number, event: any, validFiles: File[]): void {
        this.errorMessage = '';
        if (this.selectedFiles.length >= 1) {
            this.showErrorMessage('You can upload only one file at a time.');
            return;
        }
        for (const file of Array.from(files)) {
            if (!this.isValidFile(file, allowedExtensions, maxSize)) {
                event.target.value = '';
                return;
            }
            validFiles.push(file);
        }
        if (validFiles.length > 0) {
            this.selectedFiles = validFiles;
        }
    }

    /**
     *Function to check file valid or not.
     * @author PSI-Enhancements
     * @param files
     * @param allowedExtensions
     * @param maxSize
     * @param event
     * @param validFiles 
     */
    handleFileUpload(files: FileList, allowedExtensions: string[], maxSize: number, event: any, validFiles: File[]): void {
        if (files.length > 5) {
            alert('Only 5 files are allowed to be uploaded.');
            return;
        }

        for (const file of Array.from(files)) {
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (file.size > maxSize) {
                alert(`${file.name} is too large! Please upload a file up to 10 MB.`);
                return;
            }
            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                alert(`Only ${allowedExtensions.join(', ')} files are allowed to be uploaded.`);
                return;
            }
            validFiles.push(file);
        }
        this.selectedFiles = validFiles;
        this.selectedFileCount = validFiles.length;
    }

    /**
     *Function to check file valid or not.
     * @author PSI-Enhancements
     * @param file
     * @param allowedExtensions
     * @param maxSize
     * @returns boolean
     * 
     */
    isValidFile(file: File, allowedExtensions: string[], maxSize: number): boolean {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (file.size > maxSize) {
            this.showErrorMessage(`${file.name} is too large! Please upload a file up to 10 MB.`);
            return false;
        }

        if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            this.showErrorMessage(`Only ${allowedExtensions.join(', ')} files are allowed to be uploaded.`);
            return false;
        }

        return true;
    }


    /**
     *Function to show error message.
     * @author PSI-Enhancements
     * @param message
     * @param clear
     * @param duration
     */
    showErrorMessage(message: string, clear = true, duration = 3000): void {
        this.errorMessage = message;
        if (clear) {
            setTimeout(() => (this.errorMessage = ''), duration);
        }
    }

    /**
     *Function to change the file size format.
     * @author PSI-Enhancements
     * @param size
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
     * @param fileType
     */
    convertFileType(fileType: any) {
        const parts = fileType.split('/');
        return parts[1];
    }

    /**
     *Function to delete file.
     * @author PSI-Enhancements
     * @param deletedIndex
     */
    onFileDeleted(deletedIndex): void {
        this.selectedFiles.splice(deletedIndex, 1);
        this.changeFileUpload.emit(this.selectedFiles);
        this.fileDeleted.emit();
    }

    /**
     *Function to delete all Attachment.
     * @author PSI-Enhancements
     * @param deletedIndex
     */
    clearAttachment() {
      this.selectedFiles  = [];
      this.changeFileUpload.emit(this.selectedFiles);
      this.fileDeleted.emit();
    }

    /**
     * The onDeleteUploadFile function deletes an upload file and displays a success or error message
     * accordingly.
     * @author PSI-VIII
     * @param {any} file 
     */
    onDeleteUploadFile(file: any): void {
        const fileId = file.id || file.upload_id;
        this.commonBackendService.deleteUploadFile(fileId).subscribe(
            (response: any) => {
                if (response.hasError) {
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                } else {
                    if (file.id) {
                        this.selectedFileUrls = this.selectedFileUrls.filter(f => f.id !== file.id);
                    } else if (file.upload_id) {
                        this.uploadFileUrls = this.uploadFileUrls.filter(f => f.upload_id !== file.upload_id);
                    }

                    const noFilesLeft =
                        this.selectedFiles.length === 0 &&
                        this.selectedFileUrls.length === 0 &&
                        this.uploadFileUrls.length === 0;

                    if (noFilesLeft) {
                        this.fileDeleted.emit(this.configUpload?.name);
                    }
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
                }
            },
            (error) => {
                this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
            }
        );
    }
}
