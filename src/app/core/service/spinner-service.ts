import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  spinnerCount: number = 0;

  show() {
    this.spinnerCount = 1;
  }

  hide() {
    this.spinnerCount = 0;
  }

  add() {
    this.spinnerCount++;
  }

  remove() {
    this.spinnerCount--;
  }
}
