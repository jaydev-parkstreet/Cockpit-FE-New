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
  @Input() errorMessage:string = '';
  @Input() fileSizeMessage:any ;
  @Output() changeFileUpload = new EventEmitter<any>();
  @Input() convertFileSizes: (size: number) => string;
  @Input() convertFileType: (type: string) => string;

  constructor() { }

  ngOnInit(): void {  
  }

  onFileChange(event: any): void {
    this.changeFileUpload.emit(event);
  }

  deleteFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }
}
