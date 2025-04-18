import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-psi-radio-button',
  templateUrl: './psi-radio-button.component.html',
  styleUrls: ['./psi-radio-button.component.scss']
})
export class PsiRadioButtonComponent implements OnInit {
    @Input() model: any;
    @Input() field: any;

    @Output() modelChange = new EventEmitter<any>();

    constructor() { }

    ngOnInit(): void {
    }

    /**
    * Handles the change event from the radio button Emits the value to the parent
    * @param event
    * @author psi-enhancement
    */
    onRadioChange(event: Event): void {
        this.model = this.field?.value;
        this.modelChange.emit(this.model);
    }

}
