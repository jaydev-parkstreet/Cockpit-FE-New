import { Injectable } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import * as moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class PsiAgGridService {

  constructor(private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {}

  /**
   * Sorting function for AG Grid
   * @param sortModel
   * @param data
   * @returns
   */
  sortData(sortModel: any[], data: any[]): any[] {
    if (!sortModel || sortModel.length === 0) {
      return data; 
    }

    return [...data].sort((a, b) => {
      for (let sortColModel of sortModel) {
        let valueA = a[sortColModel.colId];
        let valueB = b[sortColModel.colId];

        if (valueA === valueB) continue; 

        let sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
        return valueA > valueB ? sortDirection : sortDirection * -1;
      }
      return 0;
    });
  }

  /**
   * Format currency
   * @param value
   * @returns
   */
  currencyFormat(value: number | string | null): string {
    return value !== null && value !== undefined
      ? this.currencyPipe.transform(value) ?? ''
      : '---';
  }

  /**
   * Format date
   * @param value
   * @param format
   * @returns
   */
  dateFormat(value: string | Date | null, format: string = 'MMM dd, y'): string {
    return value !== null && value !== undefined && value !== '0000-00-00 00:00:00'
      ? this.datePipe.transform(moment(value).toDate(), format) ?? ''
      : '---';
  }

  /**
   * Show a loading icon if value is not available
   * @param value
   * @returns
   */
  loadingRenderer(value: any): string {
    return value !== null && value !== undefined
      ? value
      : '<i class="fas fa-circle-notch fa-spin fa-2x fa-fw"></i>';
  }

  /**
   * Show '---' if value is null
   * @param value
   * @returns
   */
  dashRenderer(value: any): string {
    return value === null ? '---' : value;
  }

  /**
   * Show 'N/A' if value is null
   * @param value
   * @returns
   */
  naRenderer(value: any): string {
    return value === null ? 'N/A' : value;
  }
}
