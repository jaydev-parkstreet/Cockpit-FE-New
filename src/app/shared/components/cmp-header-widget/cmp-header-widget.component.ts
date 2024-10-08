import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cmp-header-widget',
  templateUrl: './cmp-header-widget.component.html',
  styleUrls: ['./cmp-header-widget.component.scss']
})
export class CmpHeaderWidgetComponent implements OnInit {
  @Input() headerTitle: string;
  @Input() showTooltip: boolean;
  @Input() badgeText: string;
  @Input() badgeClass: string;
  @Input() badgeIconClass: string;
  @Input() iconShowTooltip: boolean;
  @Input() iconHeaderStatus: string;
  @Input() paymentEnabled: boolean;
  @Input() invoiceData: any;
  @Input() iconClass: string;
  constructor() { }

  ngOnInit(): void {
  }

}
