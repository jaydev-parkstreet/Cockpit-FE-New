import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import AppRoutes from 'src/app/app.routes';
import AppConstant from 'src/app/app.constant';

@Injectable({
    providedIn: 'root'
})
export class ProductManagementService {

    constructor(
        private http: HttpClient, private commonService: CommonService,
        private dropdownService: InputDropdownService,
    ) { }
    CONSTANTS: any = AppConstant;

    /**
      * Function to get top bar config.
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
            width: 120,
            minWidth: 100,
            maxWidth: 150,
            headerClass: 'check',
            suppressMenu: true,
            suppressSorting: true,
            sortable: false,
            lockPosition: true,
            resizable: false,
            cellClass: 'select-all-header-cell pl0px header-check check'
        }, {
            headerName: 'Product Code',
            minWidth: 200,
            width: 200,
            field: 'product_id',
            cellRenderer: 'idRender',
            cellClass: 'tooltip-cell'
        },
        { headerName: 'Product Description', minWidth: 75, width: 193, field: 'description', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Supplier', minWidth: 75, width: 115, field: 'client_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Brand', minWidth: 75, width: 115, field: 'brand_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Product Status',  minWidth: 120, width: 140, field: 'status', cellRenderer: 'statusRenderer', cellClass: 'tooltip-cell prod_status' },
        { headerName: 'TTB ID', minWidth: 60, width: 108, field: 'ttb_id', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Date Created', field: 'created_date', minWidth: 75, width: 142, cellRenderer: 'dateFormatRenderer'},
        { headerName: 'Product Type', minWidth: 75, width: 134, field: 'product_type', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Product Sub-Type ', minWidth: 75, width: 171, field: 'sub_type', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Source', field: 'source', minWidth: 75, width: 125, cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'CRM', minWidth: 75, width: 140, field: 'crm', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        {
            headerName: 'Organic',
            field: 'is_organic',
            minWidth: 75,
            width: 125,
            cellRenderer: 'dashRenderer',
            cellClass: 'tooltip-cell'
        }
        ];
    }

    /**
     * Gets the grid options for the product summary table.
     * @returns {any}
     * @author PSI-Enhancements
     */
    getGridOption() {
        return {
            components: {
                checkbox: (params) => this.renderCheckbox(params),
                dashRenderer: (params) => this.renderDash(params),
                idRender: (params) => this.renderId(params),
                statusRenderer: (params) => this.renderStatus(params),
                dateFormatRenderer: (params) => this.dateFormatRenderer(params)
            },
            enableColResize: true,
            allowContextMenuWithControlKey: true,
            rowBuffer: 0,
            infiniteInitialRowCount: 1,
            maxConcurrentDatasourceRequests: 2,
            enableServerSideSorting: true,
            suppressRowTransform: true,
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
            getRowId: (params) => params.data.product_id,
        };
    }

    /**
     * Renders a checkbox in the grid column, checked or unchecked depending on the row data.
     * @param {object} params
     * @returns {string}
     * @author PSI-Enhancements
     */
    renderCheckbox(params) {
        let checkboxSelection = '';
        if (params.data) {
            if (params.data.checked) {
                checkboxSelection = `<label class="checkbox-container">
                                <input type="checkbox" class="checkbox_gir_row" checked>
                                <span class="checkmark"></span>
                            </label>`;
            } else {
                checkboxSelection = `<label class="checkbox-container">
                                    <input type="checkbox" class="checkbox_gir_row">
                                    <span class="checkmark"></span>
                                </label>`;
            }
            checkboxSelection += `<span class="attachments-notes">
                                <i class="${params.data.total_attachments <= 0 ? 'fal fa-file' : 'fas fa-file'} show-attachment-modal"></i>
                                <span><i class="${params.data.total_notes <= 0 ? 'fal fa-comment' : 'fas fa-comment'} note-modal"></i></span>`;
            if (params.data.unread_notes_count) {
                checkboxSelection += `<span class="note-count ${params.data.unread_notes_count > 9 ? 'u-w-20' : ''}">
                                    <p>${params.data.unread_notes_count}</p></span>`;
            }
            checkboxSelection += '</span>';
        }
        return checkboxSelection;
    }

    /**
     * Render a dash when there is no value, otherwise render the value inside
     * a text ellipsis container with a tooltip.
     *
     * @param {object} params
     * @returns {string}
     * @author PSI-Enhancements
     */
    renderDash(params) {
        if (params.value) {
            return `<div class="text-ellipsis"><span>${params.value}</span>
                    <span class="add-tooltip">${params.value}</span></div>`;
        }
        return '--';
    }

    /**
     * Creates an anchor link element for the product ID.
     *
     * @param params
     * @returns {string}
     * @author PSI-Enhancements
     */
    renderId(params) {
        if (params.value === null || params.value === '---' || params.value === '-') {
            return '--';
        } else if (params.data && params.data.product_id) {
            let fbStatusToolTip = '';
            if (params.data.ns_status === 2) {
                fbStatusToolTip = `
                <i class="fas fa-clock sync-pending u-base-warning">
                    <div class="tooltip-content_">
                        <div class="tooltip-text_"><span class="sync-heading">Sync Status:</span> In Queue</div>
                        <i></i>
                    </div>
                </i>`;
            } else if (params.data.ns_status === 3 && params.data.status === "Pending") {
                fbStatusToolTip = `
                <i class="fas fa-exclamation-circle sync-failed u-base-error">
                    <div class="tooltip-content_pending_status">
                        <div class="tooltip-text_">
                            <span class="fail">Sync Status:<span class="fail-msg"> Failed</span></span>
                        </div>
                        <i></i>
                    </div>
                </i>`;
            }
            else if (params.data.ns_status === 3 && params.data.status !== "Pending") {
                fbStatusToolTip = `
                <i class="fas fa-exclamation-circle sync-failed u-base-error">
                    <div class="tooltip-content_">
                        <div class="tooltip-text_ u-pg-g-1">
                            <span class="fail">Sync Status:<span class="fail-msg"> Failed</span></span>
                            <span class="re-sync">Re-Sync</span>
                        </div>
                        <i></i>
                    </div>
                </i>`;
            }
            return `
                <div class="text-ellipsis">
                    <a target="_blank" style="color: black; text-decoration: none;" 
                        onmouseover="this.style.textDecoration='underline'"
                        onmouseout="this.style.textDecoration='none'" 
                        href="product-management/${params.value}">
                        ${params.value}
                    </a>
                    ${fbStatusToolTip}
                    <span class="add-tooltip">${params.value}</span>
                </div>`;
        } else {
            return '<i class="fas fa-circle-notch fa-spin fa-fw" style="font-size:20px"></i>';
        }
    }

    /**
     * Returns the status of the product with an associated color.
     * @param {Object} params
     * @returns {String}
     * @author PSI-Enhancements
     */
    renderStatus(params) {
      const statusLabels = {
        Approved: 'u-bg-success',
        Pending: 'u-bg-warning',
        'Pre-Approved': 'u-bg-primary text-ellipsis',
        'Needs Action-Waiting on Supplier': 'u-bg-warinig-medium text-ellipsis',
        'Request Received': 'u-bg-neutral-light text-ellipsis',
      };
  
      if (statusLabels[params.value]) {
        return `<span class="typography-caption-dark-medium ${statusLabels[params.value]} status-label">${params.value}</span>`;
      }
      return '--';
    }

    /**
     * Function to get attachment list
     * @param params 
     * @author PSI-Enhancement
     */
    getAttachmentList (param:any) {        
        return this.http.get(environment.apiRouteUrl+environment.version.v1+ AppRoutes.COMMON.ATTACHMENTS+'?', { params: param });
    }

    /**
     * Cell Renderer for the formatting the Date
     * 
     * @param params 
     * @returns string - Formated Date
     * @author PSI-Enhancement
     */
    dateFormatRenderer(params) {
        return this.commonService.dateFormat(params.value);
    }

    /**
     * This function returns the config for top panel which includes search bar, filter dropdowns and action buttons.
     * @param permission
     * @param isActive
     * @returns {object} The config object for top panel.
     * @author PSI-Enhancements
     */
    getTopPanelConfig(permission, isActive = false) {
        return {
            placeholder: 'Search',
            searchText: '',
            searchOptions: {},
            expandFilter: false,
            totalResult: 0,
            permission: permission,
            actions: [],
            filtersConfig: [
                {
                    key: 'clients',
                    label: 'Supplier',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding',
                    setting: this.getMultiSelectConfig('Select Supplier')
                }, {
                    key: 'product_state',
                    label: 'Product Status',
                    type: 'multiselect-search',
                    divClass: 'col-4',
                    setting: this.getMultiSelectConfig('Select Status')
                }, {
                    key: 'product_type',
                    label: 'Product Type',
                    type: 'multiselect-search',
                    divClass: 'col-4 norightpadding',
                    setting: this.getMultiSelectConfig('Select Type')
                }, {
                    key: 'product_sub_type',
                    label: 'Product Sub-Type',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding',
                    setting: this.getMultiSelectConfig('Select Sub-Type')
                }, {
                    key: 'source',
                    label: 'Source',
                    type: 'multiselect-search',
                    divClass: 'col-4',
                    setting: this.getMultiSelectConfig('Select Source')
                }, {
                    key: 'crm',
                    label: 'CRM',
                    type: 'multiselect-search',
                    divClass: 'col-4 norightpadding', 
                    setting: this.getMultiSelectConfig('Select CRM')
                }, {
                    key: 'brand',
                    label: 'Brand',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding',
                    showSelectAll: false,
                    setting: this.getMultiSelectConfig('Select Brand', 'name', true, environment.apiRouteUrl+environment.version.v1+ AppRoutes.PRODUCT_TOOL.BRAND_SEARCH)
                }, {
                    key: 'sub-brand',
                    label: 'Sub-Brand',
                    type: 'multiselect-search',
                    divClass: 'col-4',
                    showSelectAll: false,
                    setting: this.getMultiSelectConfig('Select Sub-Brand', 'name', true, environment.apiRouteUrl+environment.version.v1+ AppRoutes.PRODUCT_TOOL.SUB_BRAND_SEARCH)
                }, {
                    key: 'sub-brands-product',
                    label: 'Sub-Brand Product',
                    type: 'multiselect-search',
                    divClass: 'col-4 norightpadding',
                    showSelectAll: false,
                    setting: this.getMultiSelectConfig('Select Sub-Brand Product', 'name', true, environment.apiRouteUrl+environment.version.v1+ AppRoutes.PRODUCT_TOOL.SUB_BRAND_PRODUCT_SEARCH)
                }, {
                    key: 'organic',
                    label: 'Organic',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding', 
                    setting: this.getMultiSelectConfig('Select Organic')
                },
                { type: 'checkbox', name: 'is_active', label: 'Inactive Only', placeholder: 'Inactive Only', divClass: 'col-4' },
                { type: 'checkbox', name: 'is_rejected', label: 'Rejected Only', placeholder: 'Rejected Only', divClass: 'col-4' }
            ],
        };
    }

    getActionsIconsConfig (groupActions, permission, reqObj = {}, isActive = false) {
        const actionIconsConfig: any = [];
        actionIconsConfig.push({
            key: 'mass_upload',
            type: 'icon',
            iconClass: 'fas fa-layer-plus',
            showTooltip: true,
            tooltipText: 'Import bulk products',
        });
        if (groupActions) {
            if (permission?.permissions?.Update) {
                actionIconsConfig.push({
                    key: 'attachment',
                    type: 'icon',
                    iconClass: 'far fa-paperclip',
                    showTooltip: true,
                    tooltipText: 'Attach',
                }, {
                    key: 'notes',
                    type: 'icon',
                    iconClass: 'fas fa-comment',
                    showTooltip: true,
                    tooltipText: 'Note',
                }, {
                    key: 'active',
                    type: 'icon',
                    iconClass: isActive ? 'fas fa-check-circle' : 'fas fa-times-circle',
                    showTooltip: true,
                    isActive,
                    tooltipText: isActive ? 'Activate' : 'Deactivate',
                }, {
                    key: 'edit',
                    type: 'icon',
                    iconClass: 'fas fa-pen',
                    showTooltip: true,
                    tooltipText: 'Edit',
                })
            }
        }
        actionIconsConfig.push({
            type: 'export',
            tooltipText: 'Export to Excel',
            apiUrl: environment.apiUrl + AppRoutes.PRODUCT_TOOL.EXCEL_EXPORT,
            params: this.commonService.parseRequest(reqObj)
        });
        actionIconsConfig.push({
            key: 'result',
            type: 'result',
        });
        actionIconsConfig.push({
            key: 'filter_button',
            type: 'filter_button',
            buttonClass: 'secondary u-pg-w-16'
        });
        if (permission?.permissions?.Create) {
            actionIconsConfig.push({
                key: 'new_product',
                type: 'button',
                divClass: '',
                buttonText: 'New Product',
                buttonIconLeft: 'fas fa-plus-circle',
                buttonClass: 'primary large'
            });
        }
        actionIconsConfig.push();
        return actionIconsConfig;
    }

    /**
     * Generates a configuration object for multi-select dropdowns.
     *
     * @param placeholdertext
     * @param name
     * @returns An object
     * @author PSI-Enhancements
     */
    getMultiSelectConfig(placeholdertext, name = 'name', serverSearch = false, apiUrl = '') {
        return {
            enableSearch: true,
            dynamicTitle: true,
            showSelectAll: true,
            keyboardControls: true,
            displayProp: name,
            searchField: name,
            scrollable: true,
            clearSearchOnClose: true,
            closeOnDeselect: false,
            idProperty: 'id',
            checkBoxes: true,
            buttonClasses: 'c-btn c-btn--secondary c-btn--full u-h3 ps-select',
            translationTexts: { buttonDefaultText: placeholdertext, searchPlaceholder: 'Search', noResultText: 'No results found' },
            ...(serverSearch && { serverSearch, apiUrl })
        };
    }

    /**
     * Formats an array of objects into a dropdown-compatible format.
     * 
     * @param values
     * @param name
     * @returns An array of objects suitable for use in a dropdown
     * @author PSI-Enhancements
     */
    formatDropdownValue(values, name = '') {
        let dropdown = [];
        if (name) {
            dropdown.push({ 'value': undefined, 'name': name });
        }
        for (let i = 0; i < values.length; i++) {
            dropdown.push({ value: values[i].id, id: values[i].id, name: values[i].name });
        }
        return dropdown;

    }

    /**
     * Fetches the summary data from the server based on the given summary data object.
     * 
     * @param summaryData
     * @param token
     * @returns A Promise containing the summary data.
     * @author PSI-Enhancements
     */
    getSummary(summaryData: any, token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.SUMMARY, summaryData, { headers }).toPromise();
    }

    /**
     * Retrieves the list of dropdown items associated with the given client ID.
     * 
     * @param token
     * @returns An Observable containing the data of dropdown items.
     * @author PSI-Enhancements
     */
    getDropdown(token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.DROPDOWN, { headers }).toPromise();
    }

    /**
     * Fetches the sub-brand products associated with the given client ID.
     * 
     * @param clientId
     * @returns An Observable containing the data of sub-brand products.
     * @author PSI-Enhancements
     */
    getSubBrandProducts(clientId: string, brandID: string) {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams()
            .set('client_id', clientId)
            .set('brand_id', brandID);
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.GET_SUB_BRAND_PRODUCT_WITH_CLIENT_ID, { headers, params })
            .pipe(map((response: any) => response.data));
    }

    /**
     * Retrieves the product details for a given product ID.
     *
     * @param id The ID of the product.
     * @returns An Observable containing the product details from the server.
     * @author PSI-Enhancements
     */
    getDetails(id) {
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.DETAILS + id)
            .pipe(map((response: any) => response.data));
    }

    /**
     * Retrieves the permission settings for the product tool.
     *
     * @returns A promise that resolves to the permission data from the server.
     * @author PSI-Enhancements
     */
    getPermission() {
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PERMISSION).toPromise();
    }

    /**
     * Function to activate or deactivate a product.
     * @param productId
     * @param isActive
     * @returns Observable containing the response from the server.
     * @author PSI-Enhancements
     */
    getActivateAPI(productId: string[], isActive) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        const body = {
            product_id: productId,
            is_active: isActive ? 0 : 1,
        };

        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_ACTIVE_DEACTIVATE, body, { headers })
            .pipe(map((response: any) => response));
    }

    /**
     * Makes an API call to export the given products to Excel.
     * @param obj
     * @returns An observable containing the HTTP response from the server.
     * @author PSI-Enhancements
     */
    excelExport(obj) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.EXCEL_EXPORT, obj)
            .pipe(map((response: any) => response));
    }

        uploadMultipleAttachments(reqObj: FormData) {
        return this.http.post(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.MULTIPLE_FILES_API, reqObj);
    }

    changeFilePermission(data: any) {
        return this.http.put(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.ATTACHMENTS_PERMISSION, data);
    }

    deleteUploadFile(param: any) {
        return this.http.delete(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.ATTACHMENTS, {
            params: new HttpParams().set('id', param),
            headers: new HttpHeaders({
                'Content-Type': ''
            })
        });
    }

    /**
     *Function to get config for mass bulk upload.
     * @author PSI-Enhancements
     */   
    getMassExcelModalData() {
        return {
            titleIcon: 'fas fa-layer-plus',
            title: 'UPLOAD BULK PRODUCT',
            modalBodyTitle: 'Upload Excel File',
            requestObj: {},
            uploadFileKey: 'file',
            modalBodyText: 'Upload bulk Products.',
            successLabelText: 'Allocated SKUs:',
            errorLabelText: 'Rows with Errors:',
            btnLabel: [
                { type: 'Btn', label: 'Cancel', class: 'secondary', isDisable: false},
                { type: 'Btn', label: 'Upload', class: 'primary' , isDisable: true}
            ]
        };
    }

    /**
     *Function to upload mass bulk product.
     * @author PSI-Enhancements
     * @param obj
     */   
    uploadbulkProducts(obj) { 
        return this.http
        .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.UPLOAD_BULK_PRODUCT, obj)
        .pipe(map((response: any) => response));
    }

    /**
     * Syncs the product order with NS.
     * @param productId
     * @returns An Observable containing the response from the server.
     * @author PSI-Enhancement
     */
    syncOrder(productId) {
        let params = {
            'productId' : productId
        };
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.NS_SYNC, params);
    }

    /**
     * Fetches the sync status details for a product
     * @param id
     * @returns An observable containing the sync status details
     * @author PSI-Enhancement
     */
    getSyncStatusDetails(id) {
        return this.http
          .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.NS_SYNC_STATUS + id);
    }

}
