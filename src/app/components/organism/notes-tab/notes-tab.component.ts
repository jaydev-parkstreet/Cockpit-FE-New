import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SimpleModalService } from 'ngx-simple-modal';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import { ProductManagementService } from '../../product-management/product-management.service';
import { CmpNotesModalComponent } from 'src/app/shared/components/cmp-notes-modal/cmp-notes-modal.component';
export interface Note {
  id: number;
  first_name: string;
  last_name: string;
  person_image: string;
  isInternalUser: number;
  permission_id: number;
  has_edit_permission: boolean;
  en_created_at: string;
  content: string;
  show_new?: boolean;
}
@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NotesTabComponent implements OnInit {
    @Input() entity:any;
    @Input() permissions:any;
    @Input() allowChangePrivacy:boolean;

    notes: [];
    isLoadingNotes: boolean;
    fileServer: string;
    updateNotePermissionLoading: boolean = false;
    filterList: any = {};

    constructor(
      private commonService: CommonService,
      private commonBackendService: CommonBackendService,
      private simpleModalService: SimpleModalService,
      private productManagementService: ProductManagementService,
    ) {}
  
    ngOnInit(): void {
      this.fileServer = environment.fileServer;
      this.loadNotes();
      this.getDropdown(); 
    }

  /**
   * Loads notes from the server based on user permissions and entity.
   *
   * @returns void
   * @author PSI-Enhancement
   */
    loadNotes() {
      this.isLoadingNotes = true;
      this.commonBackendService.getNotes(
        this.permissions.kind_id, 
        this.permissions.tool_id, 
        this.entity, 
        this.permissions.menu_item_id
      ).subscribe(
        (response: any) => {
          this.notes = response.notes;
        },
        (error) => {
          this.commonService.showToastV2Message(false, error.message || 'Failed to load notes', 'fas fa-exclamation-circle');
        },
        () => {
          this.isLoadingNotes = false;
        }
      );
    }

    /**
    * Retrieves the list of dropdown items associated with the given client ID.
    * 
    * @returns An Observable containing the data of dropdown items.
    * @author psi-enhancement
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
    * @createdDate 24-03-2025
    * @author PSI-Enhancement
    */
    addNote() {
        this.showNotesModal([this.entity], this.notes, false);
    }

     /**
     * Function to open add notes popup.
     *
     * @createdDate 24-03-2025
     * @author PSI-Enhancement
     * @param number id
     * @param array notes
     * @param boolean multiple
     */
    showNotesModal(entityIds, notes, multiple) {
        var noteDetails = { notes: [] };
        noteDetails.notes = notes;
        let modalData = {
            notesPermission: this.filterList.entity_permissions,
            cancelAction: { label: 'Cancel' },
            saveAction: { label: 'Save' },
            filtersList: this.filterList,
            permissions: this.permissions,
            entityIds: entityIds,
            modalTitle: 'NOTES',
            multiple,
            newToast: true,
            showDismissIcon: true,
            showErrorInNewToast: true,
            newToastMsg: 'Failed',
            latestDesign: true,
            noteDetails,
            showLine: true,
            noDataMessage: 'No Notes Found',
        }
        this.simpleModalService.addModal(CmpNotesModalComponent, { modalData })
        .subscribe((result) => {
            if (result !== undefined) {
                this.loadNotes();
            }
        });
    }

    /**
     * Updates the privacy permission of a note.
     * 
     * @param {Object} note - The note object containing `id` and `permission_id`.
     * @author PSI-Enhancement
     */
    updateNotePermission(note) {
      if (this.updateNotePermissionLoading) return;
      
      const newPermission = note.permission_id === 1 ? 2 : 1;
      const reqObj = {
        note_id: note.id,
        permission_id: newPermission
      };
    
      this.updateNotePermissionLoading = true;
      
      this.commonBackendService.changeNotePrivacy(reqObj).subscribe(
        (response: any) => {
          if(response.hasError) {
            this.commonService.showToastV2Message(false, 'Failed to update privacy', 'fas fa-exclamation-circle');
          } else {
            this.commonService.showToastV2Message(true, 'Privacy Updated', 'fas fa-exclamation-circle', 'success');
            note.permission_id = newPermission;
          }
        },
        (error) => {
          this.commonService.showToastV2Message(false, 'Failed to update privacy', 'fas fa-exclamation-circle');
        },
        () => {
          this.updateNotePermissionLoading = false;
        }
      );
    }

    /**
     * Delete the Note.
     * 
     * @param {Number} id.
     * @author PSI-Enhancement
     */
    deleteNote(id) {
      let modalData = {
        title: 'Are you sure you want to delete the note?',
        showLine: true,
        btnLabel: [
          { type: 'Btn', label: 'No', class: 'secondary' },
          { type: 'Btn', label: 'Yes', class: 'primary' }
        ]
      };

      this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
        .subscribe((result) => {
          if(result.btn.label === 'Yes') {
            this.commonBackendService.deleteNote(id, this.permissions.menu_item_id).subscribe((response: any) => {
              if(!response.hasError) {
                this.notes =this.commonService.deleteObjectFromArray(this.notes, 'id', id);
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
              } else {
                this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
              }
            }, 
            (error) => {
              this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
            });
          }
        })
    }
  }
  