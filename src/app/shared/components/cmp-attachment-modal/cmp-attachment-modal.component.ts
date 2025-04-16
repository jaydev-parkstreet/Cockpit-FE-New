import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { ProductManagementService } from 'src/app/components/product-management/product-management.service';
import AppConstant from 'src/app/app.constant';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';

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
    private commonBackendService: CommonBackendService,
  ) {
    super();
  }

  @ViewChild('filerInput') filerInput!: ElementRef<HTMLInputElement>;

  @Input() modalData: any;
  dropdownConfig: any;
  selectedFileCount: number = 0;
  showFooterMsg: boolean = true;
  defaultPermission: number = 0;
  permission_id: number;
  filetype_dropdown: any;
  filesTypeName: string = '';
  defaultfileTypeDropdown: any;
  fileUploader: any;
  entityId: any;
  kindid: any;
  selectedFiles: any = [];
  CONSTANTS: any = AppConstant;
  fileSizeMessage:string;
  modelAttachmentPermission: any = [];

  ngOnInit(): void {
    this.dropdownConfig = this.commonService.getSingleSelectDropdownConfig('Select permission', true);
    this.filetype_dropdown = this.commonService.getSingleSelectDropdownConfig('Select file type', true);
    this.modelAttachmentPermission = [this.modalData?.attachmentPermission[0]];
  }

 /**
 *Function to file validations.
 * @author PSI-Enhancements
 * @param event
 */
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

  /**
  *Function to remove extension from file name.
  * @author PSI-Enhancements
  * @param string
  */
  removeExtensionFromFilename(filename: any) {
    const parts = filename.split('.');
    return parts[0];
  }

  /**
  *Function to get the visibility dropdown value.
  * @author PSI-Enhancements
  * @param obj
  */
  getVisibilityDropdownValue(value: any) {
    this.permission_id = value[0]?.id;
    this.modelAttachmentPermission = value;
  }

  /**
  *Function to get the file type dropdown value.
  * @author PSI-Enhancements
  * @param obj
  */
  getFileTypeDropdownValue(value: any) {
    this.kindid = value[0]?.id;
  }

  /**
  *Function to upload attachment.
  * @author PSI-Enhancements
  */
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
    this.commonService.showSpinner();
    this.commonService.uploadMultipleAttachments(uploadParams).subscribe((response: any) => {
      this.commonService.hideSpinner();
      if (!response.hasError) {
        this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
        this.closeModal(1);
      } else {
        this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
      }
    }, (error) => {
      this.commonService.hideSpinner();
      this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
    }
    );
  }

  /**
  *Function to close modal.
  * @author PSI-Enhancements
  * @param number
  */
  closeModal(mode: number) {
    this.result = mode === 1
      ? (this.modalData?.attachmentDetails?.data?.length || 1)
      : this.modalData?.attachmentDetails?.data?.length;
    this.close();
  }

  /**
  *Function to delete the attachment.
  * @author PSI-Enhancements
  * @param obj
  */
  onDeleteClick(file: any) {
	let modalData = this.commonService.getModalData('Are you sure you want to delete the attachment?', '');

    this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
      .subscribe((result) => {
        if (result.btn.label === 'Yes') {
          this.commonBackendService.deleteUploadFile(file.upload_id)
            .subscribe((response: any) => {
              if (response.hasError) {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
              } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
                this.modalData.attachmentDetails.data = this.modalData.attachmentDetails.data.filter((item: any) => item.upload_id !== file.upload_id);
              }
            }, (error) => {
              this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
            }
            );
        }
      });
  }

  /**
  *Function to change the attachment permission.
  * @author PSI-Enhancements
  * @param obj
  */
  updateFilePermission(file: any) {
    if (file.isInternalUser === 0) {
      var permission_id = file.permission_id === this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME ? this.CONSTANTS.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME;
    } else if (file.isInternalUser === 1) {
      var permission_id = file.permission_id === this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID ? this.CONSTANTS.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : this.CONSTANTS.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID;
    }
    this.commonBackendService.changeFilePermission(file.upload_id, permission_id)
      .subscribe((response: any) => {
        if (response.hasError) {
          this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
        } else {
          file.permission_id = permission_id;
          this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
        }
      }, (error) => {
        this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
      }
      );
  }

  onFileDeleted(): void {
    if (this.selectedFiles.length === 0) {
      this.selectedFileCount = this.selectedFiles.length;
    }
  }

    /**
    *Function to update the state of submit button.
    * @author PSI-Enhancements
    */
    get isButtonDisabled(): boolean {
        return !this.selectedFileCount || this.selectedFileCount <= 0 ||
            (this.modalData.fileTypeDropdown && this.modalData.fileTypeDropdown.length <= 0) ||
            !this.kindid || this.modelAttachmentPermission.length === 0;
    }

}