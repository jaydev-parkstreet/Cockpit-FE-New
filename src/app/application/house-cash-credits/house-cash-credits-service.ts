import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppRoutes } from '../../core/constant/route.constant';

@Injectable({
  providedIn: 'root',
})
export class HouseCashCreditsService {

  getTopPanelConfig(): any {
    return {
      placeholder: 'Search',
      searchText: '',
      searchOptions: {},
      expandFilter: false,
      totalResult: 0,
      isResultLoading: true,
      actions: [{
        key: 'export-excel',
        type: 'export',
        tooltipText: 'Export to Excel',
        apiUrl: environment.apiUrl + AppRoutes.HOUSE_CASH_CREDITS.EXPORT,
        params: {}
      }, {
        key: 'overdraft-fee-bill-creation',
        type: 'icon',
        iconClass: 'fas fa-envelope-open-dollar',
        tooltipText: 'Create Overdraft Fee Bill',
        disabled: true
      }, {
        key: 'divider',
        type: 'divider',
      }, {
        key: 'result',
        type: 'result',
      }, {
        key: 'filter_button',
        type: 'filter_button',
        btnType: 'secondary',
        btnClass: 'u-pg-w-16'
      }, {
        key: 'batch_transfer',
        type: 'button',
        btnType: 'primary',
        btnText: 'Create Batch Transfers',
        disabled: false
      }],
      filtersConfig: [{
        key: 'supplier',
        label: 'Supplier',
        type: 'multiselect-search',
        divClass: 'three-col',
        placeholder: 'Select Supplier'
      }, {
        key: 'supplier_status',
        label: 'Supplier Status',
        type: 'multiselect-search',
        divClass: 'three-col',
        placeholder: 'Select Status'
      }, {
        key: 'credit_card_on_file',
        label: 'Credit Card on File',
        type: 'multiselect-search',
        divClass: 'three-col',
        placeholder: 'Select Setting'
      }, {
        key: 'source_account_transfer',
        label: 'Source Account Transfer',
        type: 'singleselect-search',
        divClass: 'three-col',
        placeholder: 'Select Account'
      }, {
        key: 'target_account_transfer',
        label: 'Target Account Transfer',
        type: 'singleselect-search',
        divClass: 'three-col',
        placeholder: 'Select Account'
      },
      { type: 'checkbox', id: 'has_suggested_transfer', label: 'Suppliers with Suggested Transfers', divClass: 'three-col d-flex flex-column-reverse' },
      { type: 'checkbox', id: 'has_negative_balance', label: 'Suppliers with Negative BA Balance' },
      { type: 'checkbox', id: 'has_overdraft_fees', label: 'Suppliers with Overdraft Fees' },
      { type: 'checkbox', id: 'suppliers_reaching_credit_limit', label: 'Suppliers reaching Credit Limit' },
      { type: 'checkbox', id: 'suppliers_exceeding_credit_limit', label: 'Suppliers exceeding Credit Limit' }]
    };
  }
  
}
