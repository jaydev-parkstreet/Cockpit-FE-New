import { Component, Input, OnInit } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import AppConstant from 'src/app/app.constant';

@Component({
  selector: 'app-attachment-tab',
  templateUrl: './attachment-tab.component.html',
  styleUrls: ['./attachment-tab.component.scss']
})
export class AttachmentTabComponent implements OnInit {

    @Input() entity:any;
    @Input() permissions:any;
    @Input() showFileType: boolean;
    @Input() showPrivacyIcon: boolean;
    
    isLoadingAttachments: boolean = false;
    updateFilePermissionLoading: boolean = false;
    attachments: [] = [];

    constructor(
      private commonBackendService: CommonBackendService,
      private commonService: CommonService,
      private simpleModalService: SimpleModalService,
    ) { }

    ngOnInit(): void {
      this.getAttachments();
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
          if(!response.hasErrors) {
            this.attachments = response.data;
          } else {
            this.commonService.showToastV2Message(true, 'Failed to load Attachments', 'fas fa-exclamation-circle');
          }
        }, (error) => {
          this.commonService.showToastV2Message(true, 'Failed to load Attachments', 'fas fa-exclamation-circle');
        }, () => {
          this.isLoadingAttachments = false;
        }
      );
    }

    /**
     * Function to delete attachment
     * 
     * @param upload_id
     * @returns void
     * @author PSI-Enhancement 
     */
    deleteAttachment(upload_id: number){
      let modalData = {
        iconClass: 'fas fa-exclamation-circle',
        title: 'Are you sure you want to delete the note?',
        showLine: true,
        btnLabel: [
          { type: 'Btn', label: 'No', class: 'secondary' },
          { type: 'Btn', label: 'Yes', class: 'primary' }
        ]
      };

      this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
        .subscribe( (result: any) => {
          if(result.btn.label === 'Yes') {
            this.commonBackendService.deleteAttachment(
              upload_id
            ).subscribe (
              (response: any) => {
                if(!response.hasError) {
                  this.attachments = this.commonService.deleteObjectFromArray(this.attachments, 'upload_id', upload_id);
                  this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
                } else {
                  this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
                }
              }, (error) => {
                this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
              }
            )
          }
      });
    }

    /**
     * Function to update the File Permissions
     * 
     * @param file 
     * @returns void
     * @author PSI-Enhancement
     */
    updateFilePermission(file) {
      if(this.isLoadingAttachments) return;
      this.isLoadingAttachments = true;
      let permission_id = file.permission_id;
      if(file.isInternalUser) {
        permission_id = file.permission_id === AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID ? AppConstant.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_PS_USER_ID;
      } else {
        permission_id = file.permission_id === AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME ? AppConstant.ENTITY_PERMISSIONS.PUBLIC_EVERYONE_ID : AppConstant.ENTITY_PERMISSIONS.PRIVATE_ONLY_ME;
      }

      this.commonBackendService.changeFilePermission(file.upload_id, permission_id)
        .subscribe((response: any) => {
          if(response.hasError) {
            this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
          } else {
            this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
            file.permission_id = permission_id;
          }
        }, (error) => {
          this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
        }, () => {
          this.isLoadingAttachments = false;
        }
      )
    }
}
