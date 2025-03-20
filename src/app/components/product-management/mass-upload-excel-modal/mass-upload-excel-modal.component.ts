import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';

export interface massUploadExcelModal {
    modalData: any;
}

@Component({
    selector: 'app-mass-upload-excel-modal',
    templateUrl: './mass-upload-excel-modal.component.html',
    styleUrls: ['./mass-upload-excel-modal.component.scss']
})
export class MassUploadExcelModalComponent extends SimpleModalComponent<massUploadExcelModal, any> implements massUploadExcelModal, OnInit {

    modalData: any;  // Add this property to the class
    selectedFiles: any = [];

    massTemplate: string = `
  <div class="drag-drop-container">
    <i class="fal fa-file"></i>
    <span>Drag & drop files here or <em>browse</em></span>
    <span>.xlsx only, 10 MB per file</span>
  </div>
`;

    constructor() {
        super();
    }

    ngOnInit(): void {
        console.log(this);
    }

    onFileChange(event: any) {
        const files: FileList = event.target.files;
        const allowedExtensions = ['xlsx'];
        const maxSize = 10 * 1024 * 1024;
        const validFiles: File[] = [];
        if (files.length > 1) {
          alert('Only 1 files are allowed to be uploaded.');
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
        // this.selectedFileCount = this.selectedFiles.length;
      }

}

