import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-psi-upload-files',
    templateUrl: './psi-upload-files.component.html',
    styleUrls: ['./psi-upload-files.component.scss']
})
export class PsiUploadFilesComponent implements OnInit {

    @Input() selectedFiles: any;
    @Input() isFromAttachment: boolean;
    @Input() iconClass: string;
    @Input() errorMessage: string = '';
    @Input() fileSizeMessage: any;
    @Input() field: any;
    @Input() convertFileSizes: (size: number) => string;
    @Input() convertFileType: (type: string) => string;
    @Output() changeFileUpload = new EventEmitter<any>();
    @Output() fileDeleted = new EventEmitter<void>();

    constructor() { }

    ngOnInit(): void {
    }

    /**
     * Function to emit on file changes.
     * @param event
     * @author PSI-Enhancements
     */
    onFileChange(event: any): void {
        this.changeFileUpload.emit(event);
    }

    /**
     * Function to delete uploaded file.
     * @param event
     * @author PSI-Enhancements
     */
    deleteFile(index: number): void {
        this.selectedFiles.splice(index, 1);
        this.fileDeleted.emit();
    }
}
