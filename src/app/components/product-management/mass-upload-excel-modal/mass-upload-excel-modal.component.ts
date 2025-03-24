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
    errorMessage: string = '';
    showCard: boolean = false; 
    productDetail: any[] = [];

    productCodeDetail = [
      { productCode: 'P12345', dimension: '10x10x10' },
      { productCode: 'P67890', dimension: '20x20x20' },
      { productCode: 'P54321', dimension: '15x15x15' }
  ];

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
        this.transformProductDetail();
    }

    // onFileChange(event: any) {
    //   debugger
    //     const files: FileList = event.target.files;
    //     const allowedExtensions = ['xlsx'];
    //     const maxSize = 10 * 1024 * 1024;
    //     const validFiles: File[] = [];
    //     if (files.length >=  1) {
    //         alert('Only 1 files are allowed to be uploaded.');
    //         return;
    //     }
    //     for (let i = 0; i < files.length; i++) {
    //         const file = files[i];
    //         const fileName = file.name;
    //         const fileSize = file.size;
    //         const fileExtension = fileName.split('.').pop()?.toLowerCase();

    //         if (fileSize > maxSize) {
    //             alert(`${fileName} is too large! Please upload file up to 10 MB.`)
    //             return;
    //         }

    //         if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    //             alert(`Only ${allowedExtensions.join(', ')} are allowed to be uploaded.`)
    //             return;
    //         }
    //         validFiles.push(file);
    //     }
    //     this.selectedFiles = validFiles;
    // }

    onFileChange(event: any): void {
      debugger
      const files: FileList = event.target.files;
      const allowedExtensions = ['xlsx'];
      const maxSize = 10 * 1024 * 1024;
      const validFiles: File[] = [];
      this.errorMessage = '';
      
      // If a file already exists in the selectedFiles array, prevent further upload
      if (this.selectedFiles.length >= 1) {
        this.errorMessage = 'You can upload only one file at a time.';
          return;
      }
  
      for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          const fileSize = file.size;
          const fileExtension = fileName.split('.').pop()?.toLowerCase();
  
          // Check file size
          if (fileSize > maxSize) {
            this.errorMessage = `${fileName} is too large! Please upload a file up to 10 MB.`;
              return;
          }
  
          // Check file extension
          if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            this.errorMessage = `Only ${allowedExtensions.join(', ')} files are allowed to be uploaded.`;
              return;
          }
  
          // If file is valid, add to validFiles
          validFiles.push(file);
      }
  
      // Add the valid file to selectedFiles
      if (validFiles.length > 0) {
          this.selectedFiles = validFiles;
      }
  }
  onButtonClicked() {
    this.showCard = !this.showCard;
  }
  transformProductDetail() {
    this.productDetail = [
        {
            table_headings: [
                { value: 'Type' },
                { value: 'Code' }
            ],
            table_values: this.productCodeDetail.map(product => [
                product.productCode, 
                product.dimension
            ])
        }
    ];
}
}

