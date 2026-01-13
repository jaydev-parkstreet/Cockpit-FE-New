import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  searchText: string = '';

  /**
   * Clear the search text
   * @author PSI-Enhancements
   * @returns void
   */
  clearSearchText(): void {
    this.searchText = '';
  }
}
