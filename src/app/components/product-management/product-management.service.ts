import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductManagementService {

    constructor(private http: HttpClient,
        private dropdownService: InputDropdownService,
    ) { }



    
    getTopPanelConfig() {
        return {
            filtersConfig: [
                this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-4', null, 'ps-required-asterisk'),
                this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-4', null, 'ps-required-asterisk'),
                this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-4', null, 'ps-required-asterisk'),
                this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-4', null, 'ps-required-asterisk'),
                this.dropdownService.createFilterObj('sub_brand', 'sub_brand', 'Sub-Brand Product', 'Select Type', 'sub_brand', true, true, null, null, 'col-4', null, 'ps-required-asterisk')
            ]
        };
    }
    
    /**
      * Function to get top bar config.
      * @createdDate 19-09-2024
      * @author PSI-Enhancements
      */
    getSummaryTopBarConfig() {
        return {
            filtersConfig: {
                totalResult: 0,
                filterArray: [

                ]
            },
            placeholder: 'Search',
            searchText: '',
            searchOptions: {},
            expandFilter: false,
            actions: []
        }
    };

    /**
     * Function to return summary table header config array
     * @createdDate 01-10-2024
     * @author PSI-Enhancements
     */
    getSummaryTableHeaderConfig() {
        return [{
            headerName: '',
            field: 'data',
            cellRenderer: 'checkbox',
            width: 150,
            minWidth: 65,
            maxWidth: 150,
            headerClass: 'check',
            suppressMenu: true,
            suppressSorting: true,
            lockPosition: true,
            resizable: false,
            cellClass: 'select-all-header-cell pl0px header-check check'
        }, {
            headerName: 'Product Code',
            headerTooltip: 'Product Code',
            minWidth: 150,
            width: 150,
            field: 'product_id',
            cellRenderer: 'idRender'
        },
        { headerName: 'Product Description', headerTooltip: 'Product Description', minWidth: 75, width: 193, field: 'description', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Supplier', headerTooltip: 'Client', minWidth: 75, width: 115, field: 'client_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Brand', headerTooltip: 'Brand', minWidth: 75, width: 115, field: 'brand_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Product Status', headerTooltip: 'Product Status', minWidth: 100, width: 175, field: 'status', cellRenderer: 'statusRenderer', cellClass: 'tooltip-cell prod_status' },
        { headerName: 'TTB ID', headerTooltip: 'TTB ID', minWidth: 60, width: 108, field: 'ttb_id', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Date Created', field: 'created_date', minWidth: 75, width: 142, cellRenderer: 'dateFormat'},
        { headerName: 'Product Type', headerTooltip: 'Product Type', minWidth: 75, width: 134, field: 'product_type', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Product Sub-Type ', headerTooltip: 'Product Sub-Type', minWidth: 75, width: 171, field: 'sub_type', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Source', headerTooltip: 'Source', field: 'source', minWidth: 75, width: 125, cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'CRM', headerTooltip: 'CRM', minWidth: 75, width: 140, field: 'crm', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        {
            headerName: 'Organic',
            headerTooltip: 'Organic',
            field: 'is_organic',
            minWidth: 75,
            width: 125,
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }
        ];
    }
  
    getGridOption() {
        return {
            components: {
            checkbox: (params) => this.renderCheckbox(params),
            dashRenderer: (params) => this.renderDash(params),
            idRender: (params) => this.renderId(params),
            statusRenderer: (params) => this.renderStatus(params),
            },
            enableColResize: true,
            allowContextMenuWithControlKey: true,
            rowBuffer: 0,
            infiniteInitialRowCount: 1,
            maxConcurrentDatasourceRequests: 2,
            enableServerSideSorting: true,
            defaultColDef: {
            width: 200,
            sortable: true,
            resizable: true,
            filter: false,
            },
            rowHeight: 38,
            headerHeight: 38,
            suppressRowClickSelection: true,
            rowModelType: 'infinite',
            paginationPageSize: 25,
            sortingOrder: ['desc', 'asc'],
            cacheBlockSize: 25,
            cacheOverflowSize: 1,
            debug: false,
            suppressRowDeselection: true,
            columnDefs: this.getSummaryTableHeaderConfig(),
            rowSelection: 'multiRow',
            overlayLoadingTemplate: `<div class="no-data-message">
                                        <i class="far fa-surprise"></i>
                                        <span>No Records Found.</span>
                                    </div>`,
            getRowId: (data) => data.id,
        };
    }
  
    renderCheckbox(params) {
        let checkboxSelection = '';
        if (params.data) {
            checkboxSelection += `<span class="custom-checkbox"><label class="checkbox-container">
                                    <input type="checkbox" class="checkbox_gir_row">
                                    <span class="checkmark"></span>
                                </label></span>`;
            checkboxSelection += `<span class="attachments-notes">
                                <i class="${params.data.total_attachments <= 0 ? 'far fa-file' : 'fas fa-file'} show-attachment-modal"></i>
                                <span><i class="${params.data.total_notes <= 0 ? 'far fa-comment' : 'fas fa-comment'} note-modal"></i></span>`;
            if (params.data.unread_notes_count) {
            checkboxSelection += `<span class="note-count ${params.data.unread_notes_count > 9 ? 'u-w-20' : ''}">
                                    <p>${params.data.unread_notes_count}</p></span>`;
            }
            checkboxSelection += '</span>';
        }
        return checkboxSelection;
    }
  
    renderDash(params) {
        if (params.value) {
            return `<div class="text-ellipsis"><span>${params.value}</span>
                    <span class="add-tooltip">${params.value}</span></div>`;
        }
        return '--';
    }
  
    renderId(params) {
      if (params.value) {
        return `<a target="_blank" href="product-tool/${params.value}">${params.value}</a>`;
      }
      return '-';
    }
  
    renderStatus(params) {
      const statusLabels = {
        Approved: 'u-bg-light-green',
        Pending: 'u-bg-light-yellow',
        'Pre-Approved': 'u-bg-light-blue',
        'Needs Action-Waiting on Supplier': 'u-bg-orange',
        'Request Received': 'u-bg-light-gray',
      };
      
      let inActiveIcon = params.data && params.data.is_active === 0 
        ? `<i class="fas fa-ban u-ml2 neutral-light icon-vertical-middle"></i>` 
        : '';
  
      if (statusLabels[params.value]) {
        return `<span class="typography-caption-dark-medium ${statusLabels[params.value]} status-label">${params.value}</span>` + inActiveIcon;
      }
      return '--';
    }


    getSummary(summaryData: any, token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(environment.apiUrl + "product-tool/summary", summaryData, { headers }).toPromise();
    }

    getDropdown(token) {
        // const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOjE2NTUsImFsbG93X2FkbWluX2NsaWVudHMiOjEsImlzQWRtaW4iOnRydWUsIklzVXNlckFmZmlsaWF0ZWQiOnRydWUsInBlcnNvbl9pZCI6MjMwMywiaXNPcGVuVXNlciI6dHJ1ZSwiZGVmYXVsdF90eXBlIjoxLCJjdXN0b21lcl9pZCI6MCwiaXNDdXN0b21lckNvbXBhbnkiOmZhbHNlLCJtYXJrZXRfcGxhY2UiOjEsImlzX2ZyZWVfdXNlciI6ZmFsc2UsImlzRnJlZUNvbXBhbnkiOmZhbHNlLCJ1c2VybmFtZSI6InljYXN0aWxsbyIsImZ1bGxfbmFtZSI6Illvc2VseW4gQ2FzdGlsbG8iLCJmaXJzdF9uYW1lIjoiWW9zZWx5biIsImxhc3RfbmFtZSI6IkNhc3RpbGxvIiwiZW1haWwiOiJ5Y2FzdGlsbG9AcGFya3N0cmVldC5jb20iLCJ0ZXJtc19hY2NlcHRlZCI6MSwiZGVwbGV0aW9uX2FjY2VwdGVkIjoxLCJkaXNwbGF5X2Fubm91bmNlbWVudF9zdGF0dXMiOjAsInBlcm1pc3Npb25zIjp7ImFsbG93X2FkbWluX2NsaWVudHMiOjEsImFsbG93X3NhbGVzX2J5X2RhdGVfcmFuZ2UiOjEsImFsbG93X3NhbGVzX2J5X21vbnRoIjoxLCJhbGxvd19jdXN0b21lcl9iYWxhbmNlX3JlcG9ydCI6MSwiYWxsb3dfaW52ZW50b3J5IjoxLCJhbGxvd19jYXNoX3JlcG9ydCI6MSwiYWxsb3dfZG9jdW1lbnRfY2VudGVyIjoxLCJhbGxvd19wYXJrX3N0cmVldF9pcHQiOjEsImFsbG93X3Bhcmtfc3RyZWV0X3VuaXZlcnNpdHkiOjEsImFsbG93X3N5bmNfbWFuYWdlciI6MSwiYWxsb3dfZGVwbGV0aW9uX3JlcG9ydCI6MSwiYWxsb3dfaW5kdXN0cnlfY29ubmVjdCI6MSwiYWxsb3dfc3RhdGVfcmVndWxhdGlvbnMiOjEsImFsbG93X2FkbWluX3JlcV9kaXN0IjoxfSwiaXNfMkZBX2FjdGl2ZSI6MCwidmVyaWZpY2F0aW9uX3R5cGUiOiJzbXMiLCJwaG9uZV9ubyI6IiIsImlzX2VtYWlsX3ZlcmlmaWVkIjoxLCJzaG93X25ld19uYXZpZ2F0aW9uIjoxLCJzaG93X25hdmlnYXRpb25fYmFubmVyIjoxLCJyZXN0cmljdF9jb21wZXRpdGlvbl9tYW5hZ2VyX25hdmlnYXRpb24iOnRydWUsImlzX3dob2xlc2FsZXIiOmZhbHNlLCJjbGllbnRJZHMiOiIxNjA2LDExODUiLCJhbGxfY2xpZW50c19zZWxlY3RlZCI6ZmFsc2UsImNsaWVudHMiOlsiMzg0MTEiXSwiY29tcGFuaWVzIjpbXSwiY29tcGFueV9jaGFuZ2UiOjEsInVzZUNvbXBhbnlJZCI6ZmFsc2UsImlzTWFrZXIiOmZhbHNlfSwiZXhwIjoxNzI3OTUyNjE2fQ.Ra2kCetugM6z5X8SeaYRlvpjyM7wBihtTDfaBRIOOOY';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get("http://api.parkstreet.local/v1/product-tool/dropdown", { headers }).toPromise();
    }

    getDetails(id) {
        return this.http
        .get(environment.apiUrl + "product-tool?product_id=" + id)
        .pipe(map((response :any) => response.data));
    }
}



