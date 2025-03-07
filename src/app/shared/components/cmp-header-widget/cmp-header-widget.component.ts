import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cmp-header-widget',
  templateUrl: './cmp-header-widget.component.html',
  styleUrls: ['./cmp-header-widget.component.scss']
})
export class CmpHeaderWidgetComponent implements AfterViewInit {
  @Input() headerTitle: string;
  @Input() hasTooltip: boolean;
  @Input() badgeText: string;
  @Input() badgeClass: string;
  @Input() iconShowTooltip: boolean;
  @Input() iconHeaderStatus: string;
  @Input() hasRightErrorIcon: string;
  @Input() rightErrorIconClass: string;
  @Input() rightErrorIconDescription: string;  
  @Input() rightErrorIconDescriptionClass: boolean;
  @ViewChild('headerDiv') headerDiv!: ElementRef;
  showTooltip: boolean = false;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.listen(this.headerDiv.nativeElement, 'mouseenter', () => this.checkTruncate());
    this.renderer.listen(this.headerDiv.nativeElement, 'mouseleave', () => this.showTooltip = false);
  }

  checkTruncate() {
    const element =  this.headerDiv.nativeElement;
    this.showTooltip = element.scrollWidth > element.clientWidth;
  }
}
