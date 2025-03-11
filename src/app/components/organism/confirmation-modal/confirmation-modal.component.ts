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
export class ConfirmationModalComponent extends SimpleModalComponent<ConfirmModel, any> implements ConfirmModel {

    modalData: any;
    constructor(
        private SimpleModalService: SimpleModalService) {
        super();
    }

    /**
     * function to submit and cancel form.
     * @param btn
     * @author PSI-Enhancement
     */
    onClickBtn(btn): void {
        this.result = { btn };
        this.close();
    }
}
