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
    entity_kind: any;

    constructor(
        private simpleModalService: SimpleModalService,
        private commonService: CommonService,
        private productmanagementService: ProductManagementService,
    ) { super(); }

    @Input() modalData: any;
    dropdownConfig: any;
    permission_id: any;
    editorContent: any;
    selectedNoteId: any;
    fileServer: any = environment.fileServer;
    isNotesListVisible: boolean;
    filters: {};
    defaultPermission: number;
    notes_permission: any;

    /**
    * Text editor configuration 
    * @createdDate 21-03-2025
    * @author PSI-Enhancements
    */
    public editorConfig = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [
                {
                    color: [
                        '#000000', '#444444', '#666666', '#999999', '#cccccc', '#eeeeee', '#f3f3f3', '#ffffff',
                        '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#9900ff', '#ff00ff',
                        '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc',
                        '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd',
                        '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0',
                        '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79',
                        '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47',
                        '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#073763', '#20124d', '#4c1130'
                    ]
                },
            ],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ header: [1, 2, 3, false] }],
            ['link', 'image', 'code-block'],
            [{ align: [] }],
        ]
    };

    ngOnInit(): void {
        this.isNotesListVisible = true;
        this.filters = {};
        if (this.modalData.notesPermission) {
            this.defaultPermission = (this.modalData.defaultPermission) ? this.modalData.defaultPermission : 0;
            this.notes_permission = this.modalData.notesPermission[this.defaultPermission].id;
            this.filters = this.modalData.notesPermission[this.defaultPermission];
        }
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
    closeModal() {
        this.result = this.modalData?.noteDetails?.notes?.length;
        this.close();
    }

    /**
    * Function to save new note 
    * @createdDate 21-03-2025
    * @param Number value
    * @author PSI-Enhancements
    */
    uploadNotes() {
        let modal = {
            note_description: this.editorContent,
            entity_kind: this.entity_kind,
            notes_permission: this.permission_id || 1,
            id: this.selectedNoteId
        };
        let req = {
            tool_id: this.modalData.filtersList.tool_id || this.modalData.permissions.tool_id,
            entity_kind: this.modalData.filtersList.note_kind_id || this.modalData.filtersList.kind_id || this.modalData.permissions.kind_id,
            content: this.editorContent,
            permission_id: this.permission_id || 1,
            menu_item_id: this.modalData.filtersList.menu_item_id || this.modalData.permissions.menu_item_id,
        };
        this.commonService.saveNote(this.modalData.entityIds, modal, req).subscribe((result: any) => {
            if (!result.hasError) {
                this.displaySuccessMessage();
            }
        })
    }

    /**
    * Function to delete note 
    * @createdDate 21-03-2025
    * @param Number value
    * @author PSI-Enhancements
    */
    onDeleteClick(id: any) {
        let modalData;

        modalData = {
            title: 'Are you sure you want to delete the note?',
            iconClass: 'fas fa-exclamation-circle error',
            btnLabel: [
                { type: 'Btn', label: 'No', class: 'secondary' },
                { type: 'Btn', label: 'Yes', class: 'primary' }
            ]
        };
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
            .subscribe((result) => {
                if (result.btn.label === 'Yes') {
                    this.commonService.deleteNote(id, this.modalData.permissions.menu_item_id)
                        .subscribe((response: any) => {
                            if (response.hasError) {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
                            } else {
                                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
                                this.modalData.noteDetails.notes = this.modalData.noteDetails.notes.filter((item: any) => item.id !== id);
                            }
                        }, (error) => {
                            this.commonService.showToastV2Message(true, 'Falied', 'fas fa-exclamation-circle');
                        });
                }
            });

    }

    /**
    * Function to display success message
    * @createdDate  29-01-2023
    * @author PSI-Enhancement
    */
    displaySuccessMessage() {
        let count = null;
        let toastMessage = 'Note Added';
        if (this.modalData.multiple) {
            count = 1;
        } else if (this.selectedNoteId) {
            count = this.modalData.noteDetails.notes.length;
            toastMessage = 'Note Updated';
        } else {
            count = this.modalData.noteDetails.notes.length + 1;
        }
        this.result = count;
        this.close();
        if (this.modalData.newToast) {
            this.commonService.showToastV2Message(true, toastMessage, 'fas fa-check-circle', 'success');
        } else {
            this.commonService.showToastV2Message(true, 'Saved Successfully', 'cockpit-topbar', 'success');
        }
    }

    /**
    * Function to edit note 
    * @createdDate 21-03-2025
    * @param Number value
    * @author PSI-Enhancements
    */
    onEditClick(note: any) {
        this.isNotesListVisible = false;
        this.editorContent = note?.content;
        this.entity_kind = note.entity_kind;
        this.permission_id = note.permission_id;
        this.selectedNoteId = note.id;

        for (var a in this.modalData.notesPermission) {
            if (this.modalData.notesPermission[a].id === note.permission_id) {
                this.filters = {
                    id: this.modalData.notesPermission[a].id,
                    name: this.modalData.notesPermission[a].name
                };
            }
        }
    }
}
