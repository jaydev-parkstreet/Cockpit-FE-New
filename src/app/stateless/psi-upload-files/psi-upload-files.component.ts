import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-psi-upload-files',
    templateUrl: './psi-upload-files.component.html',
    styleUrls: ['./psi-upload-files.component.scss']
})
export class PsiUploadFilesComponent implements OnInit {
    @Input() configUpload: any
    @Input() isShowUploader: boolean;
    @Input() iconClass: string;
    @Input() errorMessage: string = '';
    @Input() fileSizeMessage: any;
    @Input() field: any;
    @Output() changeFileUpload = new EventEmitter<any>();
    @Output() fileDeleted = new EventEmitter<void>();
    selectedFileCount: number;
    selectedFiles: File[] = [];

    constructor() { }

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
        this.changeFileUpload.emit(this.selectedFiles);

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
    }
}
