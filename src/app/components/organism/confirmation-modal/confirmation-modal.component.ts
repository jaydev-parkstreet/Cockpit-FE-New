import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent, SimpleModalService } from 'ngx-simple-modal';

export interface ConfirmModel {
  modalData: any;
}


@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent extends SimpleModalComponent<ConfirmModel, any> implements ConfirmModel{

modalData: any;
constructor(private SimpleModalService: SimpleModalService) {
  super();
}

confirm(): void{
  this.result = {confirm: true};
  this.close();
}

cancel(): void{
  this.result = {cancel: true};
  this.close();
}
}

