import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cmp-button',
  templateUrl: './cmp-button.component.html',
  styleUrls: ['./cmp-button.component.scss']
})
export class CmpButtonComponent implements OnInit {
  
  @Input() buttonClass: string;
  @Input() buttonIconRight: string;
  @Input() buttonIconLeft: string;
  @Input() buttonText: string;
  @Input() isDisable: boolean;
  @Output() onClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.isDisable);
  }

}
