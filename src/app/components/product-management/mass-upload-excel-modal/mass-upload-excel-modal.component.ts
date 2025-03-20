import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';

export interface massUploadExcelModal {
  modalData: any;
}

@Component({
  selector: 'app-mass-upload-excel-modal',
  templateUrl: './mass-upload-excel-modal.component.html',
  styleUrls: ['./mass-upload-excel-modal.component.scss']
})
export class MassUploadExcelModalComponent extends SimpleModalComponent<massUploadExcelModal, any> implements massUploadExcelModal, OnInit {

  modalData: any;  // Add this property to the class

  constructor() { 
    super();
  }

  ngOnInit(): void {
    console.log(this);
    
  }
}

