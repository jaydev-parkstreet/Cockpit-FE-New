import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import AppConstant from 'src/app/app.constant';
import { ProductManagementService } from '../../product-management/product-management.service';
import { CmpAttachmentModalComponent } from 'src/app/shared/components/cmp-attachment-modal/cmp-attachment-modal.component';

@Component({
    selector: 'app-attachment-tab',
    templateUrl: './attachment-tab.component.html',
    styleUrls: ['./attachment-tab.component.scss']
})
export class AttachmentTabComponent implements OnInit {

    @Input() entity: any;
    @Input() permissions: any;
    @Input() showFileType: boolean;
    @Input() showPrivacyIcon: boolean;

    isLoadingAttachments: boolean = false;
    updateFilePermissionLoading: boolean = false;
    attachments: any;
    filterList: any = {};

    constructor(
        private commonBackendService: CommonBackendService,
        private commonService: CommonService,
        private simpleModalService: SimpleModalService,
        private productManagementService: ProductManagementService,
    ) { }

    ngOnInit(): void {
        this.getAttachments();
        this.getDropdown();
    }

    /**
    * Function to get Attachment
    * 
    * @param void
    * @retrun void
    * @author PSI-Enhancement
    */
    getAttachments() {
        this.isLoadingAttachments = true;
        this.commonBackendService.getAttachments(
            this.entity,
            this.permissions.tool_id
        ).subscribe(
            (response: any) => {
                if (!response.hasErrors) {
                    this.attachments = response;
                } else {
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                }
            }, (error) => {
                this.commonService.showToastV2Message(true, 'Failed to load Attachments', 'fas fa-exclamation-circle');
            }, () => {
                this.isLoadingAttachments = false;
            }
        );
    }

    /**
     * Function to get Dropdown
     * @author PSI-Enhancement
     */
    async getDropdown() {
        const token = localStorage.getItem('authToken');
        try {
            const response: any = await this.productManagementService.getDropdown(token);
            this.filterList = response.data;
        }
        catch (error) {
            console.error("Error fetching summary:", error);
        }
    }

    /**
     * Function to show Attachment
     * @param multiple
     * @param entityIds
     * @param attachments
     * @returns void
     * @author PSI-Enhancement 
     */
    showAttachment(multiple: any, entityIds: any, attachments: any) {
        let modalData: any;

        modalData = {
            modalTitle: 'Attachment',
            showDismissIcon: true,
            noDataMessage: 'No Attachments Found',
            emptyDataIcon: 'far fa-surprise',
            entityIds: entityIds,
            attachmentPermission: this.filterList.entity_permissions,
            cancelAction: { label: 'Cancel' }, saveAction: { label: 'Save' }, filtersList: this.filterList,
            multiple: multiple, uploadButtonName: 'Choose File',
            customClass: true, showHorizontalLine: true,
            newDeletePopup: true,
            showErrorInNewToast: true,
            hideAttachmentLockIcon: true,
            showFileType: true,
            fileTypeDropdown: this.permissions.entity_kinds,
            showChangePrivacyIcon: true,
            newToastMsg: 'Failed',
            msg: 'Are you sure you want to delete the attachment?',
            newToast: true, showBlurEffect: true, deleteModalWindowClass: 'custom-attachment-delete',
            deleteModalFirstAction: {
                label: 'No',
                style: 'custom-attachment-delete-fa'
            },
            deleteModalSecondAction: {
                label: 'Yes',
                style: 'custom-attachment-delete-sa'
            },
            attachmentDetails: JSON.parse(JSON.stringify(attachments)),
            showLine: true, showScroll: true
        };
        this.simpleModalService.addModal(CmpAttachmentModalComponent, { modalData })
            .subscribe((result) => {
                if (result !== undefined) {
                    this.getAttachments();
                }
            });
    }

    /**
     * Function to delete attachment
     * 
     * @param upload_id
     * @returns void
     * @author PSI-Enhancement 
     */
    deleteAttachment(upload_id: number) {
        let modalData = this.commonService.getModalData('Are you sure you want to delete the attachment?', '');

        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result.btn.label === 'Yes') {
                    this.commonBackendService.deleteUploadFile(upload_id)
                        .subscribe((response: any) => {
                            if (response.hasError) {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                            } else {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
                                this.attachments.data = this.attachments.data.filter((item: any) => item.upload_id !== upload_id);
                            }
                        }, (error) => {
                            this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
                        }
                        );
                }
            }
            );
    }

    /**
     * Function to update the File Permissions
     * 
     * @param file 
     * @returns void
     * @author PSI-Enhancement
     */
    updateFilePermission(file) {
        if (this.isLoadingAttachments) return;
        this.isLoadingAttachments = true;
        let permission_id = file.permission_id;
        if (file.isInternalUser) {
            permission_id = file.permission_id === AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID ? AppConstant.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID;
        } else {
            permission_id = file.permission_id === AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME ? AppConstant.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME;
        }

        this.commonBackendService.changeFilePermission(file.upload_id, permission_id)
            .subscribe((response: any) => {
                if (response.hasError) {
                    this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
                } else {
                    this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
                    file.permission_id = permission_id;
                }
            }, (error) => {
                this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
            }, () => {
                this.isLoadingAttachments = false;
            }
            )
    }

    /**
     * Function to add attachments
     * @param file 
     * @returns void
     * @author PSI-Enhancement
     */
    addAttachments() {
        this.showAttachment(false, [this.entity], this.attachments);
    }
}
