import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductManagementService {

    constructor(private http: HttpClient) { }



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
            headerClass: 'check',
            suppressMenu: true,
            width: 80,
            minWidth: 80,
            maxWidth: 80,
            suppressSorting: true,
            headerName: '',
            field: 'data',
            lockPosition: true,
            resizable: false,
            cellRenderer: 'checkbox',
            cellClass: 'check'
        }, {
            headerName: 'Product Code',
            headerTooltip: 'Product Code',
            minWidth: 70,
            width: 100,
            field: 'product_id',
            cellRenderer: 'idRender'
        }, {
            headerName: 'Product Description',
            headerTooltip: 'Product Description',
            minWidth: 70,
            width: 150,
            field: 'description',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Brand',
            headerTooltip: 'Brand',
            minWidth: 70,
            width: 100,
            field: 'brand_name',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Status',
            headerTooltip: 'Status',
            minWidth: 70,
            width: 100,
            field: 'status',
            cellRenderer: 'statusRenderer',
            sort: 'desc'
        }, {
            headerName: 'TTB ID',
            headerTooltip: 'TTB ID',
            minWidth: 70,
            width: 120,
            field: 'ttb_id',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Product Type',
            headerTooltip: 'Product Type',
            minWidth: 70,
            width: 90,
            field: 'product_type',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Product Sub-Type',
            headerTooltip: 'Product Sub-Type',
            minWidth: 70,
            width: 120,
            field: 'sub_type',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Source',
            headerTooltip: 'Source',
            minWidth: 70,
            width: 100, field: 'source',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }, {
            headerName: 'Organic',
            headerTooltip: 'Organic',
            minWidth: 70,
            width: 100,
            field: 'is_organic',
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }
        ];
    }

    getDropdown (token) {
      const headers = new HttpHeaders().set('Authorization',`Bearer ${token}`);
      return this.http.get(environment.apiUrl +"product-tool/dropdown", { headers }).toPromise();
    }
  
    getGridOption() {
        return {
            components: {
                checkbox: (params) => {
                    let checkboxSelection;
                    if (params.data !== undefined) {
                        // checkboxSelection = this.commonService.getCheckboxConfig(params.data.checkbox);
                        // if (permission.Create) {
                        checkboxSelection = checkboxSelection +
                            `<span class="attachments-notes">
                              <i class="${params.data.total_attachments <= 0 ? 'fal fa-file' : 'fas fa-file'} show-attachment-modal"></i>
                              <span><i class="${params.data.total_notes <= 0 ? 'fal fa-comment' : 'fas fa-comment'} note-modal"></i></span>`;
                        if (params.data.unread_notes_count) {
                            checkboxSelection = checkboxSelection + `<span class="note-count ${params.data.unread_notes_count > 9 ? 'u-w-20' : ''} "><p>
                              ${params.data.unread_notes_count}</p></span>`;
                        }
                        checkboxSelection = checkboxSelection + '</span>';
                        // }
                    }
                    return checkboxSelection;
                },
                dashRenderer: (params) => {
                    if (params.value) {
                        return '<div class="text-ellipsis"><span>' + params.value + '</span>' +
                            '<span class="add-tooltip">' + params.value + '</span></div>';
                    } else {
                        return '--';
                    }
                },
                idRender: (params) => {
                    if (params.value) {
                        return '<a target="_blank" href="product-tool/' + params.value + '" >' + params.value + '</a>';
                        // return permission.Read ? '<a target="_blank" href="product-tool/' + params.value + '" >' + params.value + '</a>' : params.value;
                    } else {
                        return '-';
                    }
                },
                statusRenderer: (params) => {
                    let inActiveIcon = '';
                    if (params.data && params.data.is_active === 0) {
                        inActiveIcon = `<i class="fas fa-ban u-ml2 neutral-light icon-vertical-middle"></i>`;
                    }
                    if (params.value === 'Approved') {
                        return `<span class="typography-caption-dark-medium u-bg-light-green status-label">${params.value}</span>` + inActiveIcon;
                    } else if (params.value === 'Pending') {
                        return `<span class="typography-caption-dark-medium u-bg-light-yellow status-label">${params.value}</span>` + inActiveIcon;
                    } else if (params.value === 'Pre-Approved') {
                        return `<span class="typography-caption-dark-medium u-bg-light-blue status-label">${params.value}</span>` + inActiveIcon;
                    } else if (params.value === 'Needs Action-Waiting on Supplier') {
                        return `<span class="typography-caption-dark-medium u-bg-orange status-label widthAction">${params.value}</span>` + inActiveIcon;
                    } else if (params.value === 'Request Received') {
                        return `<span class="typography-caption-dark-medium u-bg-light-gray status-label widthRequest">${params.value}</span>` + inActiveIcon;
                    } else {
                        return '--';
                    }
                },
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
                filter: true
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
            rowDeselection: true,
            columnDefs: this.getSummaryTableHeaderConfig(),
            rowSelection: 'multiple',
            overlayLoadingTemplate: `<div class="no-data-message">
                                      <i class="far fa-surprise"></i>
                                      <span>No Records Found.</span>
                                  </div>`,
            getRowNodeId: (data) => {
                return data.id;
            }
        };
    }


    getSummary(summaryData: any, token) {

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(environment.apiUrl + "product-tool/summary", summaryData, { headers }).toPromise();
  }

    
}


