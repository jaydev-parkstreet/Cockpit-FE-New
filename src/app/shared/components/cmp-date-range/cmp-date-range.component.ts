import { Component, OnInit, Input, EventEmitter, Output, HostListener } from '@angular/core';

@Component({
  selector: 'app-cmp-date-range',
  templateUrl: './cmp-date-range.component.html',
  styleUrls: ['./cmp-date-range.component.scss']
})
export class CmpDateRangeComponent implements OnInit {

  isOpen: boolean = false;
  @Input() label: string;
  @Input() required: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  /**
  * Handles the click event outside the dropdown to close it.
  * @param {MouseEvent} event
  * @author PSI-Enhancement
  * @returns void
  */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isOpen && !target.closest('.input-dropdown')) {
      this.isOpen = false;
    }
  }

  /**
  * Checks if the dropdown is currently open.
  * @param none
  * @returns {boolean}
  * @author PSI-Enhancement
  */
  isDropdownOpen(): boolean {
    return this.isOpen;
  }

}
