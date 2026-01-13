import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Switcher {
  icon: string;
  tooltipText: string;
  key: string;
  tooltipPosition: 'left' | 'right' | 'center';
};

@Component({
  selector: 'app-tool-header',
  imports: [CommonModule],
  templateUrl: './tool-header.html',
  styleUrl: './tool-header.scss',
})
export class ToolHeader {
  @Input() headerText: string = '';
  @Input() headerIcon: string = '';
  @Input() switcherConfig: Switcher[] = [];
  @Input() activeSwitcher: string = '';
  @Output() onClick = new EventEmitter<Switcher>();

  /**
   * @description Handles the click event for a switcher.
   * @created 01/08/2025
   * @author PSI-II
   * @param {Switcher} switcher - The switcher that was clicked.
   * @returns void
   */
  onSwitcherClick(switcher: Switcher): void {
    this.activeSwitcher = switcher.key;
    this.onClick.emit(switcher);
  }

}
