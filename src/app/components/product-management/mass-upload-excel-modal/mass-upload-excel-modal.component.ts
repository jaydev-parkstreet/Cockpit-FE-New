import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { ProductManagementService } from '../product-management.service';
import { CommonService } from 'src/app/core/services/common.service';

export interface massUploadExcelModal {
    modalData: any;
}

@Component({
    selector: 'app-mass-upload-excel-modal',
    templateUrl: './mass-upload-excel-modal.component.html',
    styleUrls: ['./mass-upload-excel-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MassUploadExcelModalComponent extends SimpleModalComponent<massUploadExcelModal, any> implements massUploadExcelModal, OnInit {

    modalData: any;
    selectedFiles: any = [];
    errorMessage: string = '';
    showCard: boolean = false; 
    productDetail: any[] = [];
    productCodeDetail: any = [];
    productCounts: any ;
    isLoadingUploads: boolean = false;
    configUpload: any;

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
        this.configUpload = {
            allowedExtensions: ['xlsx'],
            isShowUploader: false
        }
    }
    
    /**
     *Function to map product details.
     * @author PSI-Enhancements
     */
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

    /**
     *Function to on button click event .
     * @author PSI-Enhancements
     * @param event
     */
    onButtonClicked(event) {
        this.result = { event , sellectedFiles: this.selectedFiles };
        const uploadParams = new FormData();
        if (event === 'Upload') {           
            let sellectedFiles =  this.selectedFiles;
            uploadParams.append('file', sellectedFiles[0]);
            this.isLoadingUploads = true;
            this.productManagementService.uploadbulkProducts(uploadParams).subscribe((response) => {
                this.isLoadingUploads = false;
                if (!response.hasError) {
                    this.productCodeDetail = response.data;
                    this.productCounts = response.counts;
                    this.modalData.btnLabel[0].label = 'Back';
                    this.modalData.btnLabel[1].label = 'Done';
                    this.transformProductDetail();
                    this.showCard = !this.showCard;
                } else {
                    this.errorMessage = response.msg;
                    setTimeout(() => {
                      this.errorMessage = '';
                    }, 3000);
                }
            }); 
        }  else if (event === 'Back') {
            this.showCard = !this.showCard;
            this.selectedFiles = [];
            this.modalData.btnLabel[0].label = 'Cancel';
            this.modalData.btnLabel[1].label = 'Upload';
            this.modalData.btnLabel[1].isDisable = true;
        } else {
            this.close();
        }
    }

    /**
    *Function to call on file upload.
    * @author PSI-Enhancements
    * @param event
    */
    onFileChange(file: any): void {
        this.selectedFiles = file;
        if (this.selectedFiles.length > 0) {
            this.modalData.btnLabel[1].isDisable = false;
        } else {
            this.modalData.btnLabel[1].isDisable = true;
        }
    }
}
