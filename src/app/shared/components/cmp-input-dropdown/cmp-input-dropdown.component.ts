import { Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-cmp-input-dropdown',
  templateUrl: './cmp-input-dropdown.component.html',
  styleUrls: ['./cmp-input-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CmpInputDropdownComponent),
      multi: true,
    },
  ],
})
export class CmpInputDropdownComponent implements OnInit, OnChanges, ControlValueAccessor {
  @Input() label: string;
  @Input() validationClasses: string;
  @Input() settings: any = {};
  @Input() filteredItems: any ;
  @Input() formControl: FormControl;
  @Input() showSelectAll: boolean = true;
  @Input() showCheckboxes: boolean = true;
  @Input() allowSingleSelect: boolean = false;
  @Output() onDropDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isActive: boolean = false;


  @Output() dropdownStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // items: string[] = ['Request Received', 'Needs Action-Waiting on Supplier', 'Approved', 'Pending', 'Pre-Approved'];
  selectedItems: any;
  isOpen: boolean = false;
  searchText: string = '';
  isAllSelected: boolean = false;
  hideList: boolean = false;
  // filteredItems: string[] = [...this.items];


  texts = {
    noResultText: 'No results found',
    selectAll: 'Select All',
    uncheckAll: 'Uncheck All'
  };

  ngOnInit(): void {
    this.selectedItems = this.formControl?.value || [];
    this.updateFilteredItems(this.filteredItems);
    this.updateSelectAllState(this.filteredItems);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive'] && this.isActive) {
      this.isOpen = true; 
    } else {
      this.isOpen = false; 
    }
  }


  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.dropdownStateChange.emit(this.isOpen);
  }
  

  isDropdownOpen(): boolean {
    return this.isOpen;
  }

  toggleSelection(item: string): void {
    if (this.allowSingleSelect) {
        this.selectedItems = [item];
        this.isOpen = false;
        
        this.updateFormControl();
    } else {
        const index = this.selectedItems.indexOf(item);
        if (index === -1) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems.splice(index, 1);
        }
    }
    this.onDropDownChange.emit(this.selectedItems);
  }
  
  onChevronClick(event: MouseEvent): void {
    console.log("Chevron clicked", event.target);
    event.stopPropagation();

    event.preventDefault();
    this.toggleDropdown();
  }
  
  toggleSelectAll(): void {
    if (this.isAllSelected) {
        this.selectedItems = [];
    } else {
        this.selectedItems = [...this.filteredItems];
    }
    this.isAllSelected = !this.isAllSelected;

    this.onDropDownChange.emit(this.selectedItems);
    this.updateFormControl(); 
  }
  
  updateFormControl(): void {
    if (this.formControl) {
        this.formControl.setValue(this.selectedItems);
        this.formControl.updateValueAndValidity();
    } 
    
  }
  updateSelectAllState(items): void {
    this.isAllSelected = this.selectedItems.length === items.length;
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  
  filterItems(items): void {
    const searchTextLower = this.searchText.toLowerCase();
    this.filteredItems = items.filter(item =>
      item.toLowerCase().includes(searchTextLower)
    );
    this.hideList = this.filteredItems.length === 0 && this.searchText !== '';
  }

  clearSearch(): void {
    this.searchText = '';
    this.updateFilteredItems(this.filteredItems);
  }

  private updateFilteredItems(items): void {
    this.filteredItems = [...items];
    this.hideList = false;
  }

  getSelectedText(): string {
    if (this.selectedItems.length === 0) {
        return 'Select Items';
    }
    if (this.allowSingleSelect) {
      return this.selectedItems[0].name
    }
    const firstItem = this.selectedItems[0].name;
    const additionalCount = this.selectedItems.length - 1;
    return additionalCount > 0 ? `${firstItem}, +${additionalCount}` : firstItem;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isOpen && !target.closest('.input-dropdown')) {
      this.isOpen = false;
    }
  }

  writeValue(obj: any): void {
    this.selectedItems = obj || [];
    this.updateFilteredItems(this.filteredItems);
  }

  registerOnChange(fn: any): void {
    this.onDropDownChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Implement if needed
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }
}