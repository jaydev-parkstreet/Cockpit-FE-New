import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  @Input() btnText: string | null = null;
  @Input() btnType: 'primary' | 'secondary' | 'ghost' = 'primary';
  @Input() btnSize: 'large' | 'medium' | 'small' = 'large';
  @Input() btnClass: string | null = null;
  @Input() buttonIconRight: string | null = null;
  @Input() buttonIconLeft: string | null = null;
  @Input() tooltipText: string | null = null;
  @Input() isDisable: boolean = false;
  @Output() onClick = new EventEmitter<any>();
}
