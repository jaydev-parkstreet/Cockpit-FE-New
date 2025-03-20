import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { ProductManagementService } from 'src/app/components/product-management/product-management.service';
import AppConstant from 'src/app/app.constant';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';

export interface ConfirmModel {
  modalData: any;
}


@Component({
  selector: 'app-cmp-attachment-modal',
  templateUrl: './cmp-attachment-modal.component.html',
  styleUrls: ['./cmp-attachment-modal.component.scss']
})
export class CmpAttachmentModalComponent extends SimpleModalComponent<ConfirmModel, any> implements ConfirmModel {


  constructor(
    private simpleModalService: SimpleModalService,
    private commonService: CommonService,
    private productmanagementService: ProductManagementService,
  ) {
    super();
  }

  @ViewChild('filerInput') filerInput!: ElementRef<HTMLInputElement>;

  @Input() modalData: any;
  @Input() attachmentDetails: any;
  dropdownConfig: any;
  filters: any = {};
  selectedFileCount: number = 0;
  showFooterMsg: boolean = true;
  defaultPermission: number = 0;
  permission_id: any;
  filetype_dropdown: any;
  filesTypeName: string = '';
  defaultfileTypeDropdown: any;
  fileUploader: any;
  entityId: any;
  kindid: any;
  selectedFiles: any = [];
  CONSTANTS: any = AppConstant;
  fileSizeMessage:string;

  ngOnInit(): void {
    this.dropdownConfig = this.commonService.getSingleSelectDropdownConfig('Select permission', true);
    this.filetype_dropdown = this.commonService.getSingleSelectDropdownConfig('Select file type', true);
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
  }

  deleteFile(index: number) {
    if (confirm('Are you sure you want to remove this file?')) {
      this.selectedFiles.splice(index, 1);
      this.selectedFileCount = this.selectedFiles.length;
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

  removeExtensionFromFilename(filename: any) {
    const parts = filename.split('.');
    return parts[0];
  }

  getVisibilityDropdownValue(value: any) {
    this.permission_id = value[0].id;
  }

  getFileTypeDropdownValue(value: any) {
    this.kindid = value[0].id;
  }

  uploadAttachments() {
    this.selectedFileCount = this.selectedFiles.length;
    const uploadParams = new FormData();
    for (let idx = 0; idx < this.selectedFiles.length; idx++) {
      uploadParams.append('file[' + idx + ']', this.selectedFiles[idx]);
    }
    uploadParams.append('entities', JSON.stringify(this.modalData.entityIds));
    uploadParams.append('kind', this.kindid);
    uploadParams.append('tool', this.modalData.filtersList.tool_id);
    uploadParams.append('menu_item_id', this.modalData.filtersList.menu_item_id);
    uploadParams.append('permission_id', this.permission_id || this.modalData.attachmentPermission[0].id);
    this.productmanagementService.uploadMultipleAttachments(uploadParams).subscribe((response: any) => {
      if (!response.hasError) {
        this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
        this.closeModal(1);
      }
    }, (error) => {
      this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
    }
    );
  }

  closeModal(mode: number) {
    this.result = mode === 1
      ? (this.modalData?.attachmentDetails?.data?.length || 1)
      : this.modalData?.attachmentDetails?.data?.length;
    this.close();
  }
  onDeleteClick(file: any) {
    let modalData;

    modalData = {
      title: 'Are you sure you want to delete the attachment?',
      iconClass: 'fas fa-exclamation-circle error',
      btnLabel: [
        { type: 'Btn', label: 'No', class: 'secondary' },
        { type: 'Btn', label: 'Yes', class: 'primary' }
      ]
    };

    this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
      .subscribe((result) => {
        if (result.btn.label === 'Yes') {
          this.productmanagementService.deleteUploadFile(file.upload_id)
            .subscribe((response: any) => {
              if (response.hasError) {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
              } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
                this.modalData.attachmentDetails.data = this.modalData.attachmentDetails.data.filter((item: any) => item.upload_id !== file.upload_id);
              }
            }, (error) => {
              this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
            }
            );
        }
      });
  }

  updateFilePermission(file: any) {
    if (file.isInternalUser === 0) {
      var permission_id = file.permission_id === this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME ? this.CONSTANTS.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME;
    } else if (file.isInternalUser === 1) {
      var permission_id = file.permission_id === this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID ? this.CONSTANTS.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID;
    }
    const data = {
      entity_upload_id: file.upload_id,
      permission_id: permission_id
    };
    this.productmanagementService.changeFilePermission(data)
      .subscribe((response: any) => {
        if (response.hasError) {
          this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
        } else {
          file.permission_id = permission_id;
          this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
        }
      }, (error) => {
        this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
      }
      );
  }

  get isButtonDisabled(): boolean {
    return !this.selectedFileCount || this.selectedFileCount <= 0 || (this.modalData.fileTypeDropdown && this.modalData.fileTypeDropdown.length <= 0) || !this.kindid;
  }

}