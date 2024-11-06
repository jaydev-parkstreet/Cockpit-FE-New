import { Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
interface Item {
  id: number;
  name: string;
}
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

export class CmpInputDropdownComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() validationClasses: string;
  @Input() settings: any = {};
  @Input() filteredItems: Item[]; 
  @Input() formControl: FormControl;
  @Input() showSelectAll: boolean = true;
  @Input() showCheckboxes: boolean = true;
  @Input() allowSingleSelect: boolean = false;
  @Input() showSearch: boolean = true;
  @Output() onDropDownChange: EventEmitter<any> = new EventEmitter<any>();
  @Input() isActive: boolean = false;
  @Output() dropdownStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedItems: any[] = []; 
  @Input() isAllItemsSelected: boolean = false;
  @Input() disabled: boolean = false; 

  isOpen: boolean = false;
  searchText: string = '';
  isAllSelected: boolean = false;
  hideList: boolean = false;
  originalItems: Item[] = [];
  static currentlyOpenDropdown: CmpInputDropdownComponent | null = null;

  texts = {
    noResultText: 'No results found',
    selectAll: 'Select All',
    uncheckAll: 'Uncheck All'
  };

  ngOnInit(): void {
    this.isOpen = false;
    this.selectedItems = this.formControl?.value || [];
    if (!Array.isArray(this.filteredItems)) {
      this.filteredItems = [];
    }
    this.filteredItems = this.filteredItems || []
    this.updateFilteredItems(this.filteredItems);
    this.updateSelectAllState(this.filteredItems);
    this.originalItems = [...this.filteredItems]; 
  }
  
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['isActive']) {
//         this.isOpen = this.isActive || false; 
//     }
//     if (changes['filteredItems']) {
//         const newItems = changes['filteredItems'].currentValue;

//         if (newItems && Array.isArray(newItems)) {
//             this.originalItems = [...newItems];
//             this.updateFilteredItems(this.originalItems);
//         } else {
//             this.originalItems = []; 
//             this.updateFilteredItems(this.originalItems);
//         }
//     }
//     if (changes['isAllItemsSelected']) {
//         this.isAllSelected = changes['isAllItemsSelected'].currentValue || false; 
//     }
//     this.updateSelectAllStates();
// }

  updateSelectAllStates(): void {
    this.isAllSelected = this.selectedItems.length === this.filteredItems.length; 
  }
  toggleDropdown(): void {
    if (this.disabled  || this.formControl?.disabled) return;
    if (CmpInputDropdownComponent.currentlyOpenDropdown && CmpInputDropdownComponent.currentlyOpenDropdown !== this) {
      CmpInputDropdownComponent.currentlyOpenDropdown.closeDropdown();
    }
    this.isOpen = !this.isOpen;
    CmpInputDropdownComponent.currentlyOpenDropdown = this.isOpen ? this : null;
    this.dropdownStateChange.emit(this.isOpen);
  }
 
  closeDropdown(): void {
    this.isOpen = false;
    this.dropdownStateChange.emit(this.isOpen);
  }

  isDropdownOpen(): boolean {
    return this.isOpen;
  }

  toggleSelection(item: Item): void {
    if (this.allowSingleSelect) {
      this.selectedItems = [item];
      this.isOpen = false;
      this.updateFormControl();
    } else {
      const index = this.selectedItems.findIndex(selectedItem => selectedItem.id === item.id);
      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 1);
      }
    }
    this.onDropDownChange.emit(this.selectedItems);
  }

  onChevronClick(event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggleDropdown();
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.originalItems];
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
  updateDropdownState(): void {
   
    if (this.isActive && !this.disabled) {
      this.isOpen = false; 
    } else {
      this.isOpen = false; 
    }
  }

  isSelected(item: Item): boolean {
    return this.selectedItems.some(selectedItem => selectedItem.id === item.id);
  }

  filterItems(): void {
    const searchTextLower = this.searchText.toLowerCase();
    if (searchTextLower.trim().length === 0) {
      this.filteredItems = [...this.originalItems]; 
      this.hideList = false; 
      return;
    }
    this.filteredItems = this.originalItems.filter((item: Item) =>
      item.name.toLowerCase().includes(searchTextLower)
    );
    this.hideList = this.filteredItems.length === 0;
  }
  
  clearSearch(event: Event): void {
    this.searchText = '';
    this.updateFilteredItems(this.originalItems);
    event.stopPropagation();
  }

  //private updateFilteredItems(items): void {
  //   this.filteredItems = [...items];
  //   this.hideList = false;
  // }
  updateFilteredItems(items): void {
    this.filteredItems = Array.isArray(items) ? [...items] : [];
    this.hideList = false;
  }

  getSelectedDisplayText(): string {
    if (this.selectedItems.length === 0) {
      return this.settings?.translationTexts?.buttonDefaultText;
    }
    if (this.allowSingleSelect) {
      return this.selectedItems[0].name
    }
    const firstItemName = this.selectedItems[0].name;
    const additionalCount = this.selectedItems.length - 1;
    return additionalCount > 0 ? `${firstItemName}, +${additionalCount}` : firstItemName;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isOpen && !target.closest('.input-dropdown')) {
      this.closeDropdown();
      CmpInputDropdownComponent.currentlyOpenDropdown = null;
    }
  }

  writeValue(obj: any): void {
    this.selectedItems = obj || [];
    this.updateFilteredItems(this.originalItems); 
  }

  registerOnChange(fn: any): void {
    this.onDropDownChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Implement if needed
  }

  // setDisabledState?(isDisabled: boolean): void {
  //   this.isDisabled = isDisabled;
  // }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.formControl) {
        if (isDisabled) {
            this.formControl.disable(); 
        } else {
            this.formControl.enable(); 
        }
    }
}
}
