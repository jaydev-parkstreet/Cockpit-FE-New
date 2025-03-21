import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { ProductManagementService } from 'src/app/components/product-management/product-management.service';
import AppConstant from 'src/app/app.constant';
import { ConfirmationModalComponent } from 'src/app/components/organism/confirmation-modal/confirmation-modal.component';

export interface notesModal {
    modalData: any;
}

@Component({
    selector: 'app-cmp-notes-modal',
    templateUrl: './cmp-notes-modal.component.html',
    styleUrls: ['./cmp-notes-modal.component.scss']
})
export class CmpNotesModalComponent extends SimpleModalComponent<notesModal, any> implements notesModal {

    constructor(
        private simpleModalService: SimpleModalService,
        private commonService: CommonService,
        private productmanagementService: ProductManagementService,
    ) { super(); }

    @Input() modalData: any;
    dropdownConfig: any;
    permission_id: any;
    editorContent:any;
    selectedNoteId:any;
    fileServer:any = environment.fileServer;
    
    public editorConfig = {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // Basic formatting
          [{ list: 'ordered' }, { list: 'bullet' }], // Lists
          [{ header: [1, 2, 3, false] }], // Headers
          ['link', 'image', 'code-block'], // Extra options
          [{ align: [] }] // Alignment
        ]
      };

    ngOnInit(): void {
        console.log(this.modalData);
        this.dropdownConfig = this.commonService.getSingleSelectDropdownConfig('Select permission', true);
    }

    /**
    * Function to store permission id on change 
    * @createdDate 21-03-2025
    * @author PSI-Enhancements
    */
    getVisibilityDropdownValue(value: any) {
        this.permission_id = value[0].id;
    }

    /**
    * Function to close the modal 
    * @createdDate 21-03-2025
    * @param Number value
    * @author PSI-Enhancements
    */
    closeModal(mode: number) {
        this.result = mode === 1
            ? (this.modalData?.attachmentDetails?.data?.length || 1)
            : this.modalData?.attachmentDetails?.data?.length;
        this.close();
    }

    /**
    * Function to save new note 
    * @createdDate 21-03-2025
    * @param Number value
    * @author PSI-Enhancements
    */
    uploadNotes(){
        let modal = {
            note_description: this.editorContent,
            entity_kind: this.modalData.filtersList.note_kind_id ||  this.modalData.filtersList.kind_id || this.modalData.permissions.kind_id,
            notes_permission: this.permission_id || 1,
            id: this.selectedNoteId
        };
        let req = {
            tool_id:  this.modalData.filtersList.tool_id || this.modalData.permissions.tool_id,
            entity_kind:  modal.entity_kind,
            content: this.editorContent,
            permission_id: this.permission_id || 1,
            menu_item_id:  this.modalData.filtersList.menu_item_id || this.modalData.permissions.menu_item_id,
        };
        console.log(req);
        this.commonService.saveNote(this.modalData.entityIds,modal, req).subscribe((result:any) => {
            console.log(result);
            if (!result.hasError) {
                this.commonService.showToastV2Message(true, result.msg, 'fas fa-exclamation-circle', 'success');
            }
        })

        
    }

}
