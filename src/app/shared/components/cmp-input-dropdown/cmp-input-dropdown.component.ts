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
    constructor(private inputDropdownService: InputDropdownService) { }

    ngOnInit(): void {
        this.isOpen = false;
        this.selectedItems = this.formControl?.value || this.selectedItems;
        if (!Array.isArray(this.filteredItems)) {
            this.filteredItems = [];
        }

        this.filteredItems = this.filteredItems || []
        this.updateFilteredItems(this.filteredItems);
        this.updateSelectAllStates();
        this.originalItems = [...this.filteredItems];
        this.searchSubject.pipe(debounceTime(750)).subscribe(searchText => {
            this.fetchOptionsFromServer(searchText);
        });
    }

    /**
	 * Function for on change event.
	 * @author PSI-Enhancements
     * @param {SimpleChanges} changes
	 */
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

    /**
     * Updates the `isAllSelected` state based on the number of selected items.
     * 
     * @param none
     * @author PSI-Enhancement
     * @returns void
     */
    updateSelectAllStates(): void {
        this.isAllSelected = this.selectedItems.length > 0;
    }

    /**
     * Toggles the dropdown open or closed.
     * 
     * @param none
     * @returns {void}
     * @author PSI-Enhancement
     */
    toggleDropdown(): void {
        if (this.disabled || this.formControl?.disabled) return;
        if (CmpInputDropdownComponent.currentlyOpenDropdown && CmpInputDropdownComponent.currentlyOpenDropdown !== this) {
            CmpInputDropdownComponent.currentlyOpenDropdown.closeDropdown();
        }
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clearSearch(null, false);
            this.showSelectAll && this.updateSelectAllStates();
        };
        CmpInputDropdownComponent.currentlyOpenDropdown = this.isOpen ? this : null;
        this.handleFilteredItemsFromServerOnClose();
        this.dropdownStateChange.emit(this.isOpen);
    }

    /**
     * Closes the dropdown and emits the dropdown state change event.
     * 
     * @param none
     * @returns {void}
     * @author PSI-Enhancement
     */
    closeDropdown(): void {
        this.isOpen = false;
        this.handleFilteredItemsFromServerOnClose();
        this.dropdownStateChange.emit(this.isOpen);
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

    /**
     * Toggles the selection of a specific item in the dropdown.
     * 
     * @param {Item} item - The item to toggle selection for.
     * @author PSI-Enhancement
     * @returns void
     */
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
        this.updateSelectAllStates();
        this.onDropDownChange.emit(this.selectedItems);
    }

    /**
     * Handles the click event on the dropdown chevron icon.
     * 
     * @param {MouseEvent} event - The click event.
     * @author PSI-Enhancement
     * @returns void
     */
    onChevronClick(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();
        this.toggleDropdown();
    }

    /**
     * Toggles the selection of all items in the dropdown.
     * 
     * @param none
     * @createdAt 31-03-2025
     * @author PSI-Enhancement
     * @returns void
     */
    toggleSelectAll(): void {
        if (this.isAllSelected) {
            this.selectedItems = [];
        } else {
            this.selectedItems = [...this.originalItems];
        }
        this.isAllSelected = !this.isAllSelected;
        this.onDropDownChange.emit(this.selectedItems);
        this.updateFormControl();
        if (this.isOpen && (this.filteredItems.length === this.selectedItems.length ||
            this.selectedItems.length === 0)) {
            this.isOpen = false;
        }
    }

    updateFormControl(): void {
        if (this.formControl) {
            this.formControl.setValue(this.selectedItems);
            this.formControl.updateValueAndValidity();
        }
    }

    isSelected(item: Item): boolean {
        return this.selectedItems.some(selectedItem => selectedItem.id === item.id);
    }

    /**
     * Fetches options from the server based on the given search text.
     * 
     * @param searchText
     * @returns void
     * @author PSI-Enhancement
     */
    fetchOptionsFromServer(searchText: string): void {
        if (searchText.trim().length !== 0) {
            this.isLoading = true;
            this.inputDropdownService.getOption(this.settings.apiUrl, searchText)
                .subscribe(response => {
                    this.filteredItems = response.hasError ? [] : response.data;
                    this.hideList = this.filteredItems.length === 0;
                    this.isLoading = false;
                }, (error) => {
                    this.filteredItems = [];
                    this.hideList = true;
                    this.isLoading = false;
                });
        } else {
            this.filteredItems = [...this.selectedItems];
        }
    }

    /**
     * Filters the items based on the search text.
     * @param none
     * @author PSI-Enhancement
     * @returns void
     */
    filterItems(): void {
        const searchTextLower = this.searchText.toLowerCase();
        this.hideList = false;
        if (this.settings.serverSearch) {
            this.searchSubject.next(searchTextLower);
        } else {
            this.filteredItems = searchTextLower.trim().length === 0
                ? [...this.originalItems]
                : this.originalItems.filter(item =>
                    String(item.name).toLowerCase().includes(searchTextLower)
                );
            this.hideList = this.filteredItems.length === 0;
        }
    }

    /**
     * Clears the selected items and resets the dropdown state.
     * @param none
     * @returns void
     * @author PSI-Enhancement
     */

    resetDropdownState() {
        this.selectedItems = [];
        this.isAllSelected = false;
        this.isIndeterminate = false;
        this.searchText = '';
        this.updateFilteredItems(this.originalItems);
        this.onDropDownChange.emit(this.selectedItems);
    }

    /**
     * Clears the search input and resets the filtered items.
     * 
     * @param {Event}
     * @param {boolean}
     * @author PSI-Enhancement
     */
    clearSearch(event: Event = null, stopEventPropagation: boolean = true): void {
        this.searchText = '';
        const itemsToFilter = this.settings.serverSearch ? this.selectedItems : this.originalItems;
        this.updateFilteredItems(itemsToFilter);
        this.hideList = false;
        this.isAllSelected = false;
        this.updateFormControl();

        if (stopEventPropagation) event.stopPropagation();
    }

    /**
     * Updates the filtered items based on the provided items.
     * @param {Item[]} items - The items to update.
     * @author PSI-Enhancement
     * @returns void
     */
    updateFilteredItems(items): void {
        this.filteredItems = Array.isArray(items) ? [...items] : [];
        this.hideList = false;
    }

    /**
     * Returns the display text for the selected items.
     * @param none
     * @returns {string}
     * @author PSI-Enhancement
     */
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
            this.closeDropdown();
            CmpInputDropdownComponent.currentlyOpenDropdown = null;
        }
    }

    /**
     * Handles the keydown event for keyboard navigation.
     * @param  obj
     * @author PSI-Enhancement
     */
    writeValue(obj: any): void {
        if (this.allowSingleSelect) {
            this.selectedItems = obj ? [obj] : [];
        } else {
            this.selectedItems = obj || [];
        }
        this.updateFilteredItems(this.originalItems);
    }

    /**
     * Registers a callback function to be called when the value changes.
     * @param fn
     * @author PSI-Enhancement
     */
    registerOnChange(fn: any): void {
        this.onDropDownChange = fn;
    }

    registerOnTouched(fn: any): void {
        // Implement if needed
    }

    /**
     * Registers a callback function to be called when the dropdown is disabled.
     * @param isDisabled
     * @author PSI-Enhancement
     */
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
     * @param {void}
     * @author PSI-Enhancements
     */
    handleFilteredItemsFromServerOnClose(): void {
        if (this.settings.serverSearch && !this.isOpen) {
            this.filteredItems = [...this.selectedItems];
            this.dropdownClosedWithServerFilteredItems.emit(this.selectedItems);
        }
    }
}
