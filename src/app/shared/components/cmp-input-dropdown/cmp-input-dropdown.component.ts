import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cmp-input-dropdown',
  templateUrl: './cmp-input-dropdown.component.html',
  styleUrls: ['./cmp-input-dropdown.component.scss']
})
export class CmpInputDropdownComponent implements OnInit {

  items: string[] = ['Request Received', 'Needs Action-Waiting on Supplier', 'Approved', 'Pending', 'Pre-Approved'];
  selectedItems: string[] = [];
  isOpen: boolean = false;
  searchText: string = '';
  isAllSelected: boolean = false;
  hideList: boolean = false;
  filteredItems = [...this.items];
  @Input() label: string; 
  @Input() placeholder: string;

  ngOnInit(): void {}

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  toggleSelection(item: string): void {
    const index = this.selectedItems.indexOf(item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectAllState();
  }

  isSelected(item: string): boolean {
    return this.selectedItems.includes(item);
  }

  getFilteredItems(): string[] {
    return this.items.filter(item =>
      item.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  toggleSelectAll(): void {
    if (this.isAllSelected) {
      this.selectedItems = [];
    } else {
      this.selectedItems = [...this.items];
    }
    this.isAllSelected = !this.isAllSelected;
  }

  updateSelectAllState(): void {
    this.isAllSelected = this.selectedItems.length === this.items.length;
  }

  getSelectedText(): string {
    if (this.selectedItems.length === 0) {
      return 'Select Items';
    }
    const firstItem = this.selectedItems[0];
    const additionalCount = this.selectedItems.length - 1;
    return additionalCount > 0 ? `${firstItem}, +${additionalCount}` : firstItem;
  }

  removeSearchText(): void {
    this.searchText = "";
    this.hideList =false;
  }
  onKeyPress($event) {
    this.filterItems(); 
  }
  filterItems() {
    if (!this.searchText) {
      this.filteredItems = [...this.items];
    } else {
      const searchTextLower = this.searchText.toLowerCase();
      this.filteredItems = this.items.filter(item =>
        item.toLowerCase().includes(searchTextLower)
      );
    }
    if(this.filterItems.length == 0){
      this.hideList = true
    }
  }

}


