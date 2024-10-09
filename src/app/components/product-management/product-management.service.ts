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
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(environment.apiUrl + "product-tool/dropdown", { headers }).toPromise();;
    }

    getDetails(id) {
        return this.http
        .get(environment.apiUrl + "product-tool?product_id=" + id)
        .pipe(map((response :any) => response.data));
    }

    getPermission() {
        return this.http
        .get(environment.apiUrl + "product-tool/permissions")
        .pipe(map((response :any) => response.data));
    }
}



