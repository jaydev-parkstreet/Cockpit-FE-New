import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-box.html',
  styleUrls: ['./search-box.scss'],
})
export class SearchBox implements OnInit, OnDestroy {
  private readonly inputSubject = new Subject<string>();
  @Input() placeholder: string = 'Search';
  @Input() size: 'Medium' | 'Small' = 'Medium';
  @Input() disabled: boolean = false;
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  ngOnInit(): void {
    this.inputSubject.pipe(debounceTime(500)).subscribe((val) => {
      this.value = val;
      this.valueChange.emit(val);
    });
  }

  /**
   * @description Handles input event and emits the updated value
   * @createdDate 16-01-2026
   * @author PSI-II
   * @param {Event} e - The input event
   * @returns {void}
   */
  onInput(e: Event): void {
    if (this.disabled) {
      return;
    }
    const input = e.target as HTMLInputElement;
    this.inputSubject.next(input.value);
  }

  /**
   * @description Clears the input value and emits the change
   * @createdDate 16-01-2026
   * @author PSI-II
   * @returns {void}
   */
  onClearInput(): void {
    if (this.disabled) {
      return;
    }
    this.value = '';
    this.valueChange.emit('');
  }

  /**
   * @description Emits the current value when search is triggered
   * @createdDate 16-01-2026
   * @author PSI-II
   * @returns {void}
   */
  onSearch(): void {
    this.valueChange.emit(this.value);
  }

  /**
   * @description Emits the current value when Enter key is pressed
   * @createdDate 16-01-2026
   * @author PSI-II
   * @returns {void}
   */
  onEnter(): void {
    if (this.disabled) {
      return;
    }
    this.valueChange.emit(this.value);
  }

  /**
   * @description Computes the CSS classes for the search box container based on size and disabled state
   * @createdDate 16-01-2026
   * @author PSI-II
   * @returns {string} The computed CSS classes
   */
  get containerClasses(): string {
    return `search-box ${this.size.toLowerCase()} ${this.disabled ? 'disabled' : ''}`;
  }

  ngOnDestroy(): void {
    this.inputSubject.complete();
  }
}
