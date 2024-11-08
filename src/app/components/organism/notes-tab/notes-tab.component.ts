import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./notes-tab.component.scss']
})
export class NotesTabComponent implements OnInit {
    notes: [];
    isLoadingNotes: boolean = true;
    permissions = { Update: true };
  
    constructor() {}
  
    ngOnInit(): void {
      this.loadNotes();
    }
  
    loadNotes() {
      // this.noteService.getNotes().subscribe(
      //   (notes) => {
      //     this.notes = notes;
      //     this.isLoadingNotes = false;
      //   },
      //   () => {
      //     this.isLoadingNotes = false;
      //   }
     // );
    }
  
    addNote() {
      // Implement your logic to add a note
      console.log('Add Note clicked');
      // You might want to open a modal or navigate to a new component
    }
  
  
    // deleteNote(noteId: number) {
    //   this.noteService.deleteNote(noteId).subscribe(() => {
    //     this.loadNotes(); // Reload notes after deletion
    //   });
    // }
  
    // updateNotePermission(note: Note) {
    //   // Logic to update note permissions
    // }
  }
  