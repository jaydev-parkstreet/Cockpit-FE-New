import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { ProductManagementService } from '../product-management.service';
import { CommonService } from 'src/app/core/services/common.service';

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

    productCodeDetail = [];

    massTemplate: string = `
  <div class="drag-drop-container">
    <i class="fal fa-file"></i>
    <span>Drag & drop files here or <em>browse</em></span>
    <span>.xlsx only, 10 MB per file</span>
  </div>
`;

    constructor(
        private productManagementService : ProductManagementService,
        private commonService: CommonService
    ) {
        super();
    }

    ngOnInit(): void {
        console.log(this);
    }

    onFileChange(event: any): void {
        const files: FileList = event.target.files;
        const allowedExtensions = ['xlsx'];
        const maxSize = 10 * 1024 * 1024;
        const validFiles: File[] = [];
        this.errorMessage = '';

        if (this.selectedFiles.length >= 1) {
          this.errorMessage = 'You can upload only one file at a time.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
          return;
        }
      
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = file.name;
          const fileSize = file.size;
          const fileExtension = fileName.split('.').pop()?.toLowerCase();
          if (fileSize > maxSize) {
            this.errorMessage = `${fileName} is too large! Please upload a file up to 10 MB.`;
            setTimeout(() => {
              this.errorMessage = '';
            }, 3000);
            return;
          }
          if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
            this.errorMessage = `Only ${allowedExtensions.join(', ')} files are allowed to be uploaded.`;
            setTimeout(() => {
              this.errorMessage = ''; 
            }, 3000);
            return;
          }
          validFiles.push(file);
        }

        if (validFiles.length > 0) {
          this.selectedFiles = validFiles;
        }
      }
      
    transformProductDetail() {
        this.productDetail = [
            {
                table_headings: [
                    { value: 'SKU' },
                    { value: 'Message' },
                    { value: 'Status' },
                ],
                table_values: this.productCodeDetail.map(product => [
                    product.key, 
                    product.msg,
                    product.status
                ])
            }
        ];
    }

    onButtonClicked(event) {
        this.result = { event , sellectedFiles: this.selectedFiles };
        console.log(this.selectedFiles);
        // this.close();
        const uploadParams = new FormData();
        console.log(event , this.selectedFiles);
        if (event === 'Upload') {           
            let sellectedFiles =  this.selectedFiles;
            uploadParams.append('file', sellectedFiles[0]);
            this.productManagementService.uploadbulkProducts(uploadParams).subscribe((response) => {
                console.log(response);
                if (!response.hasError) {
                    this.productCodeDetail = response.data;
                    this.transformProductDetail();
                    this.showCard = !this.showCard;
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
                } else {
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                }
            }); 
        }
    }
    convertFileSizes(size: any) {
        if (size >= 1024 * 1024) {
            return ((size / (1024 * 1024)).toFixed(2) + ' MB');
        } else {
            return ((size / 1024).toFixed(2) + ' KB');
        }
    }

    convertFileType(fileType: any) {
        const parts = fileType.split('/');
        return parts[1];
    }
}

