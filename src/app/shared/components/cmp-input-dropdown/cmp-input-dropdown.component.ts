import { ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDropdownService } from './input-dropdown.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
  @Input() required: boolean = false;
  @Input() isIndeterminate: boolean = false;
  @Output() dropdownClosedWithServerFilteredItems: EventEmitter<Item[]> = new EventEmitter<Item[]>();

  private searchSubject = new Subject<string>();
  isOpen: boolean = false;
  searchText: string = '';
  isAllSelected: boolean = false;
  hideList: boolean = false;
  isLoading: boolean = false;
  originalItems: Item[] = [];
  static currentlyOpenDropdown: CmpInputDropdownComponent | null = null;

  texts = {
    loaderText: 'Fetching Record...',
    noResultText: 'No results found',
    selectAll: 'Select All',
    uncheckAll: 'Uncheck All'
  };
  constructor(private inputDropdownService: InputDropdownService) {}

  ngOnInit(): void {
    this.isOpen = false;
    this.selectedItems = this.formControl?.value || this.selectedItems;
    if (!Array.isArray(this.filteredItems)) {
      this.filteredItems = [];
    }
    
    this.filteredItems = this.filteredItems || []
    this.updateFilteredItems(this.filteredItems);
    this.updateSelectAllState(this.filteredItems);
    this.originalItems = [...this.filteredItems];
    this.searchSubject.pipe(debounceTime(750)).subscribe(searchText => {
      this.fetchOptionsFromServer(searchText);
    });
  }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['isActive']) {
          this.isOpen = this.isActive || false; 
      }
      if (changes['filteredItems']) {
          const newItems = changes['filteredItems'].currentValue;
          if (newItems && Array.isArray(newItems)) {
            this.originalItems = newItems && Array.isArray(newItems) ? [...newItems] : [];
              this.updateFilteredItems(this.originalItems);
          } else {
              this.originalItems = []; 
              this.updateFilteredItems(this.originalItems);
          }
      }
      if (changes['isAllItemsSelected']) {
        this.isAllSelected = this.isAllItemsSelected; 
      }
      this.updateSelectAllStates();
  }

  updateSelectAllStates(): void {
    this.isAllSelected = this.selectedItems.length === this.filteredItems.length;
  }
  toggleDropdown(): void {
    if (this.disabled || this.formControl?.disabled) return;
    if (CmpInputDropdownComponent.currentlyOpenDropdown && CmpInputDropdownComponent.currentlyOpenDropdown !== this) {
      CmpInputDropdownComponent.currentlyOpenDropdown.closeDropdown();
    }
    this.isOpen = !this.isOpen;
    CmpInputDropdownComponent.currentlyOpenDropdown = this.isOpen ? this : null;
	this.handleFilteredItemsFromServerOnClose();
    this.dropdownStateChange.emit(this.isOpen);
  }

  closeDropdown(): void {
    this.isOpen = false;
	this.handleFilteredItemsFromServerOnClose();
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

  fetchOptionsFromServer(searchText: string): void {
    if(searchText.trim().length !== 0) {
      this.isLoading = true;
      this.inputDropdownService.getOption(this.settings.apiUrl, searchText)
        .subscribe(filteredItems => {
            this.filteredItems = filteredItems.data;
            this.hideList = this.filteredItems.length === 0;
            this.isLoading = false;
        });
    } else {
      // add selectedItems again as we have removed text from search
    }
  }

  filterItems(): void {
    const searchTextLower = this.searchText.toLowerCase();
    this.hideList = false;
    if (this.settings.serverSearch) {
      this.searchSubject.next(searchTextLower);
    } else {
      this.filteredItems = searchTextLower.trim().length === 0
        ? [...this.originalItems]
        : this.originalItems.filter(item =>
            item.name.toLowerCase().includes(searchTextLower)
          );
        this.hideList = this.filteredItems.length === 0;
    }
  }

  resetDropdownState() {
    this.selectedItems = [];
    this.isAllSelected = false;
    this.isIndeterminate = false;
    this.searchText = '';
    this.updateFilteredItems(this.originalItems);
    this.onDropDownChange.emit(this.selectedItems);
  }
  clearSearch(event: Event = null): void {
    this.searchText = ''; 
    this.updateFilteredItems(this.originalItems); 
    this.hideList = false;
    this.selectedItems = []; 
    this.isAllSelected = false; 
    this.isAllSelected = false; 
    this.updateFormControl(); 
    event.stopPropagation(); 
  }

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
    if (this.allowSingleSelect) {
      this.selectedItems = obj ? [obj] : [];
    } else {
      this.selectedItems = obj || [];
    }
    this.updateFilteredItems(this.originalItems); 
  }

  registerOnChange(fn: any): void {
    this.onDropDownChange = fn;
  }

  registerOnTouched(fn: any): void {
    // Implement if needed
  }

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

	/**
	 * Handles the event when the dropdown is closed while using server-side filtering.
	 * 
	 * @param {void}
   * @author PSI-Enhancements
	 */
	handleFilteredItemsFromServerOnClose(): void {
		if (this.settings.serverSearch && !this.isOpen) {
			this.filteredItems =  [...this.selectedItems];
			this.dropdownClosedWithServerFilteredItems.emit(this.selectedItems);
		}
	}
}
