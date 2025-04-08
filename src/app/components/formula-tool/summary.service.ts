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
export class formulaService {

    constructor(
        private http: HttpClient, private commonService: CommonService,
        private dropdownService: InputDropdownService,
    ) { }
    CONSTANTS: any = AppConstant;

    /**
      * Function to get top bar config.
      * @author PSI-VIII
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
     * @author PSI-VIII
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
            headerName: 'Unique ID',
            minWidth: 75,
            width: 115,
            field: 'unique_id',
            cellRenderer: 'idRender',
            cellClass: 'tooltip-cell'
        },
        { headerName: 'Supplier Name', minWidth: 75, width: 193, field: 'client_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Status', minWidth: 200, width: 200, field: 'formula_status', cellRenderer: 'statusRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Formula Description', minWidth: 75, width: 115, field: 'formula_description', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Classification', minWidth: 120, width: 140, field: 'classification_name', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell prod_status' },
        { headerName: 'Submission ID', minWidth: 60, width: 108, field: 'submission_id', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Formula ID', minWidth: 60, width: 108, field: 'formula_id', cellRenderer: 'dashRenderer', cellClass: 'tooltip-cell' },
        { headerName: 'Date Requested', field: 'date_requested_display', minWidth: 75, width: 142, cellRenderer: 'dateFormatRenderer' },
        { headerName: 'Date Submitted', field: 'date_submitted_display', minWidth: 75, width: 142, cellRenderer: 'dateFormatRenderer' },
        { headerName: 'Date Approved', field: 'date_approved_display', minWidth: 75, width: 142, cellRenderer: 'dateFormatRenderer' },
        { headerName: 'Date Expired', field: 'date_expired_display', minWidth: 75, width: 142, cellRenderer: 'dateFormatRenderer' },
        { headerName: 'Formula Approval Document', minWidth: 75, width: 134, field: 'display_name', cellRenderer: 'openDocument', cellClass: 'tooltip-cell' },
        ];
    }

    /**
     * Gets the grid options for the formula summary table.
     * @author PSI-VIII
     * @returns {any}
     */
    getGridOption() {
        return {
            components: {
                checkbox: (params) => this.renderCheckbox(params),
                dashRenderer: (params) => this.renderDash(params),
                idRender: (params) => this.renderId(params),
                statusRenderer: (params) => this.renderStatus(params),
                dateFormatRenderer: (params) => this.dateFormat(params),
                openDocument: (params) => this.openDocument(params)
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
            getRowId: (params) => params.data.unique_id,
        };
    }

    /**
     * Renders a checkbox in the grid column, checked or unchecked depending on the row data.
     * @author PSI-VIII
     * @param {object} params
     * @returns {string}
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
     * @author PSI-VIII
     * @param {object} params
     * @returns {string}
     */
    renderDash(params) {
        if (params.value) {
            return `<div class="text-ellipsis"><span>${params.value}</span>
                    <span class="add-tooltip">${params.value}</span></div>`;
        }
        return '--';
    }

    /**
     * Creates an anchor link element for the formula ID.
     * @author PSI-VIII
     * @param params
     * @returns {string}
     */
    renderId(params) {
        if (params.value === null || params.value === '---' || params.value === '-') {
            return '--';
        } else if (params.data && params.data.unique_id) {
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
                        href="formula/${params.value}">
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
     * Returns the status of the formula with an associated color.
     * @author PSI-VIII
     * @param {Object} params
     * @returns {String}
     */
    renderStatus(params) {
        const statusLabels = {
            Approved: 'u-bg-success',
            Rejected: 'u-bg-error',
            'Pre-Approved': 'u-bg-primary',
            'Needs Action - Waiting on Supplier': 'u-bg-warning text-ellipsis',
            'Request Received': 'u-bg-neutral-light',
            'Pending Formula Approval': 'u-bg-warning text-ellipsis',
            'Pending Samples - Waiting on Supplier': 'u-bg-warning text-ellipsis',
            'Ready for Submission': 'yellow text-ellipsis',
            'Cancelled': 'u-bg-neutral-light',
            'Under Review': 'u-bg-error-medium',
            'Filed': 'u-bg-neutral-light'
        };
    
        const value = params.value || '--';
        const labelClass = statusLabels[value] || '';
        const isExpired = !!(params.data?.is_formula_expire && params.data?.date_expired_display);
        const hasEllipsis = labelClass.includes('text-ellipsis');
    
        const iconHtml = isExpired
            ? `<i class="fas fa-exclamation-circle text-danger" title="FORMULA will expire within 30 days" style="margin-left: 6px; font-size: 14px;"></i>`
            : '';
    
        return `
            <div class="status-label-wrapper" style="display: flex; align-items: center;">
                <span
                    class="typography-caption-dark-medium ${labelClass} status-label"
                    style="padding: 2px 8px;"
                    ${hasEllipsis ? `title="${value}"` : ''}>
                    ${value}
                </span>
                ${iconHtml}
            </div>
        `;
    }        

    /**
     * Function to get attachment list
     * @author PSI-VIII
     * @param params 
     */
    getAttachmentList(param: any) {
        return this.http.get(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.ATTACHMENTS + '?', { params: param });
    }

    /**
     * Cell Renderer for the formatting the Date
     * 
     * @author PSI-VIII
     * @param params 
     * @returns string - Formated Date
     */
    dateFormat(params) {
        if (
            params.value === null ||
            params.value === "---" ||
            params.value === "-"
        ) {
            return "--";
        } else if (params.value) {
            const isExpiredFormula = params.colDef.field === 'date_expired_display' && params.data.is_formula_expire === 1;
            const colorStyle = isExpiredFormula ? 'color:#c52335;' : '';
            
            return `<div style="${colorStyle}" class="text-ellipsis add-tooltip" title="${params.value}">
                        ${params.value}
                    </div>`;
        } else {
            return params.value;
        }
    }

    openDocument(params) {
        var dispText = (params.value !== undefined && params.value !== null) ? params.value : '--';
        var tooltipText = dispText;
        var maxLength = 20;
        var truncatedText = dispText.length > maxLength ? dispText.substring(0, maxLength) + '...' : dispText;
        if (params.data && params.data.formula_document_file && dispText !== '--') {
            return '<a class="u-pointer" target="_blank" href="' + params.data.formula_document_file + '"'
                + (dispText.length > maxLength ? ' title="' + tooltipText + '"' : '') 
                + ' style="color: #1B6AC9 !important;">'
                + truncatedText + '</a>';
        } else {
            return '<span' + (dispText.length > maxLength ? ' title="' + tooltipText + '"' : '') + '>'
                + truncatedText + '</span>';
        }
    }

    /**
     * This function returns the config for top panel which includes search bar, filter dropdowns and action buttons.
     * @author PSI-VIII
     * @param permission
     * @param isActive
     * @returns {object} The config object for top panel.
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
                    key: 'client_id',
                    label: 'Supplier Name',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding',
                    setting: this.getMultiSelectConfig('Select Supplier Name')
                }, {
                    key: 'formula_status',
                    label: 'Status',
                    type: 'multiselect-search',
                    divClass: 'col-4',
                    setting: this.getMultiSelectConfig('Select Status')
                }, {
                    key: 'submission_id',
                    label: 'Submission ID',
                    type: 'multiselect-search',
                    divClass: 'col-4 norightpadding',
                    setting: this.getMultiSelectConfig('Select Submission ID')
                }, {
                    key: 'formula_id',
                    label: 'Formula ID',
                    type: 'multiselect-search',
                    divClass: 'col-4 noleftpadding',
                    setting: this.getMultiSelectConfig('Select Formula ID')
                }, {
                    key: 'date_requested',
                    label: 'Date Requested',
                    type: 'multiselect-search',
                    divClass: 'col-4',
                    setting: this.getMultiSelectConfig('mm/dd/yyyy')
                }, {
                    key: 'date_approved',
                    label: 'Date Approved',
                    type: 'multiselect-search',
                    divClass: 'col-4 norightpadding',
                    setting: this.getMultiSelectConfig('mm/dd/yyyy')
                },
                { type: 'checkbox', name: 'is_active', label: 'Formula to Expire in 30 days', placeholder: 'Formula to Expire in 30 days', divClass: 'col-4' },
                { type: 'checkbox', name: 'is_rejected', label: 'Archive only', placeholder: 'Archive only', divClass: 'col-4' }
            ],
        };
    }

    getActionsIconsConfig(groupActions, permission, reqObj = {}, isActive = false) {
        const actionIconsConfig: any = [];
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
                key: 'new_formula',
                type: 'button',
                divClass: '',
                buttonText: 'FORMULA',
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
     * @author PSI-VIII
     * @param placeholdertext
     * @param name
     * @returns An object
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
     * @author PSI-VIII
     * @param values
     * @param name
     * @returns An array of objects suitable for use in a dropdown
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
     * @author PSI-VIII
     * @param summaryData
     * @param token
     * @returns A Promise containing the summary data.
     */
    getSummary(summaryData: any, token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(environment.apiUrl + AppRoutes.FORMULA.SUMMARY, summaryData, { headers }).toPromise();
    }

    /**
     * Retrieves the list of dropdown items associated with the given client ID.
     * @author PSI-VIII
     * @param token
     * @returns An Observable containing the data of dropdown items.
     */
    getDropdown(token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(environment.apiUrl + AppRoutes.FORMULA.DROPDOWN, { headers }).toPromise();
    }

    /**
    * Retrieves the formula details for a given formula ID.
    * @author PSI-VIII
    * @param id The ID of the formula.
    * @returns An Observable containing the formula details from the server.
    */
    getDetails(id) {
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.DETAILS + id)
            .toPromise();
    }

    /**
     * Retrieves the permission settings for the formula tool.
     * @author PSI-VIII
     * @returns A promise that resolves to the permission data from the server.
     */
    getPermission() {
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PERMISSION).toPromise();
    }

    /**
     * Makes an API call to export the given formula to Excel.
     * @author PSI-VIII
     * @param obj
     * @returns An observable containing the HTTP response from the server.
     */
    excelExport(obj) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.EXCEL_EXPORT, obj)
            .pipe(map((response: any) => response));
    }

    uploadMultipleAttachments(reqObj: FormData) {
        return this.http.post(environment.apiRouteUrl + environment.version.v1 + AppRoutes.COMMON.MULTIPLE_FILES_API, reqObj);
    }

}
