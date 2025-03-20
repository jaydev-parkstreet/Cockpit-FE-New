import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-psi-upload-files',
  templateUrl: './psi-upload-files.component.html',
  styleUrls: ['./psi-upload-files.component.scss']
})
export class PsiUploadFilesComponent implements OnInit {

  @Input() selectedFiles: any;
  @Input() isFromAttachment:boolean;
  @Input() iconClass:string;
  @Input() fileSizeMessage:any ;
  @Output() change = new EventEmitter<any>();
  @Input() convertFileSizes: (size: number) => string;
  @Input() convertFileType: (type: string) => string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.fileSizeMessage);
    
  }

  onFileChange(event: any): void {
    this.change.emit(event);
  }

  deleteFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
}
