import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';
import AppRoutes from 'src/app/app.routes';

@Injectable({
    providedIn: 'root'
})
export class ProductManagementService {

    constructor(
        private http: HttpClient,private commonService:CommonService,
        private dropdownService: InputDropdownService,
    ) { }
    
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
            sortable: false,
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
            getRowId: (params) => params.data.product_id,
        };
    }

    /**
     * Renders a checkbox in the grid column, checked or unchecked depending on the row data.
     * @param {object} params
     * @returns {string}
     * @author psi-enhancement
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
  
    /**
     * Render a dash when there is no value, otherwise render the value inside
     * a text ellipsis container with a tooltip.
     *
     * @param {object} params
     * @returns {string}
     * @author psi-enhancement
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
     * @author psi-enhancement
     */
    renderId(params) {
      if (params.value) {
        return `<a target="_blank" style="color: black;text-decoration: none;" onmouseover="this.style.textDecoration='underline'"
                onmouseout="this.style.textDecoration='none'" href="product-management/${params.value}">${params.value}</a>`;
      }
      return '-';
    }
  
    /**
     * Returns the status of the product with an associated color.
     * @param {Object} params
     * @returns {String}
     * @author psi-enhancement
     */
    renderStatus(params) {
      const statusLabels = {
        Approved: 'u-bg-v2-base-success',
        Pending: 'u-bg-v2-base-warinig',
        'Pre-Approved': 'u-bg-v2-base-primary',
        'Needs Action-Waiting on Supplier': 'u-bg-v2-base-warinig-v-low',
        'Request Received': 'u-bg-v2-neutral-light',
      };
      
      let inActiveIcon = params.data && params.data.is_active === 0 
        ? `<i class="fas fa-ban u-ml2 neutral-light icon-vertical-middle"></i>` 
        : '';
  
      if (statusLabels[params.value]) {
        return `<span class="typography-caption-dark-medium ${statusLabels[params.value]} status-label">${params.value}</span>` + inActiveIcon;
      }
      return '--';
    }

    /**
     * This function returns the config for top panel which includes search bar, filter dropdowns and action buttons.
     * @param permission
     * @param isActive
     * @returns {object} The config object for top panel.
     * @author psi-enhancement
     */
    getTopPanelConfig(permission , isActive = false) {
        return {
            placeholder: 'Search',
            searchText: '',
            searchOptions: {},
            showFilter: false,
            totalResult: 0,
            permission: permission,
            actions: {
                result: {
                  key: 'result',
                  divClass: 'result-container',
                  type: 'result',
                  isShowOutSideFilter: true
                },
                extraActions: [{
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: 'Import bulk products',
                    icon: 'fas fa-layer-group',
                    key: 'mass-upload',
                    permission: permission.permissions.Create,
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: 'Attach',
                    icon: 'fas fa-paperclip',
                    key: 'attachment',
                    permission: permission.permissions.Update
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: 'Note',
                    icon: 'fas fa-comment',
                    key: 'notes',
                    permission: permission.permissions.Update
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: isActive ? 'Activate' : 'Deactivate',
                    icon: isActive ? 'fas fa-check-circle' : 'fas fa-times-circle',
                    key: 'active',
                    isActive,
                    permission: permission.permissions.Update
                  }
                ]
            },
            filtersConfig: [
                {
                    key: 'clients',
                    label: 'Supplier',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Supplier')
                }, {
                    key: 'product_state',
                    label: 'Product Status',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Status')
                }, {
                    key: 'product_type',
                    label: 'Product Type', 
                    ype: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Type')
                }, {
                    key: 'product_sub_type',
                    label: 'Product Sub-Type',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Sub-Type')
                }, { 
                    key: 'source',
                    label: 'Source',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Source')
                }, {
                    key: 'organic',
                    label: 'Organic',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding', 
                    setting: this.getMultiSelectConfig('Select Organic')
                }, {
                    key: 'active_status',
                    label: 'Active State',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    showSearch:false,
                    showSelectAll: false,
                    showCheckboxes: false,
                    allowSingleSelect: true,
                    setting: this.getMultiSelectConfig('Select State')
                }, {
                    key: 'bottles_per_case',
                    label: 'Bottles Per Case',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Bottles Per Case')
                }, {
                    key: 'container_sizes_filter',
                    label: 'Container Size',
                    type: 'multiselect-search',
                    divClass: 'col-3 norightpadding',
                    setting: this.getMultiSelectConfig('Select Container Size')
                }
            ],
        };
    }

    /**
     * Generates a configuration object for multi-select dropdowns.
     *
     * @param placeholdertext
     * @param name
     * @returns An object
     * @author psi-enhancement
     */
    getMultiSelectConfig(placeholdertext, name = 'name') {
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
        };
    }
   
    /**
     * Format the model for the product tool API.
     * @param model the model data
     * @param filtersList the filters list
     * @param subBrandProducts the sub brand products list
     * @param edit whether the form is in edit mode
     * @param duplicate whether the form is in duplicate mode
     * @param id the product id
     * @param productId the product id
     * @returns the formatted model
     * @author psi-enhancement
     */
    formatModelProductTool(model: any, filtersList: any, subBrandProducts: any[], edit: boolean, duplicate:boolean , id: number,productId:any): any {
        if (!Object.keys(model).length) {
            return {};  
        }
        const getSubBrandDetails = (subBrandProducts, sub_brand_product_id) => {
            const subBrand = subBrandProducts.find(product => product.name === sub_brand_product_id);
          
            return subBrand ? { id: subBrand.id, name: subBrand.name } : null; // Return null if not found
        };
        const result = getSubBrandDetails(subBrandProducts, model.sub_brand_product_id); 
        let modelFormat: any = {
            compliance: model.compliance === "1" ? 1 : 0,
            use_up: model.use_up === "1" ? 1 : 0,  
            is_organic: model.is_organic ? 1 : 0, 
            abv: model.abv || "", 
            cola_ttb_id: model.cola_ttb_id || "",
            nabca_code: model.nabca_code || "",
            bdn_code: model.bdn_code || "",
            unimerc_code: model?.unimerc_code || "",
            description: model.description || "", 
            product_id: model.product_id || "",
    
            // Dimensions 
            unit_height: edit ? model.unit_height || null : model.unit_height || "",
            unit_length: edit ? model.unit_length || null : model.unit_length || "",
            unit_width: edit ? model.unit_width || null : model.unit_width || "",
            unit_weight: edit ? model.unit_weight || null : model.unit_weight || "",    
            case_width: model.case_width || "",
            case_length: model.case_length || "",
            case_height: model.case_height || "",
            case_weight: model.case_weight || "",   
            pallet_length: model.pallet_length || "",
            pallet_width: model.pallet_width || "",
            pallet_height: model.pallet_height || "",
            pallet_weight: model.pallet_weight || "",          
            layers_per_pallet: model.layers_per_pallet || "",
            cases_per_layer: model.cases_per_layer || "",
            cases_per_pallet: model.cases_per_pallet || "",        
            system_id: model.system_id || "",
            scc_code: model.scc_code || "",
            upc_code: model.upc_code || "",
            client_id: model.client_id || "",             
            sub_brand_product_name: result ? result.name : subBrandProducts[0]?.name || "",
            sub_brand_product_id: result ? result.id : subBrandProducts[0]?.id || null,                   
            name: model.name || "",
            group: Array.isArray(model.group) && model.group.length > 0  ? (model.group[0]?.id || null) 
            : model.group  || null,       
            producer: Array.isArray(model.producer) && model.producer.length > 0  ? (model.producer[0]?.id || null) 
            : (model.producer ? model.producer.id || model.producer : null),       
            case_unit_of_measure: Array.isArray(model.case_unit_of_measure) && model.case_unit_of_measure.length > 0 
            ? (model.case_unit_of_measure[0].id || null) 
            : model.case_unit_of_measure || null,
            container_type: Array.isArray(model.container_type) && model.container_type.length > 0 
            ? (model.container_type[0]?.id || null) 
            : model.container_type || null,
            ex_works_cost: model.ex_works_cost || "",      
            prod_type: Array.isArray(model.prod_type) && model.prod_type.length > 0  ? (model.prod_type[0]?.id || null) 
            : model.prod_type  || null,      
            manufactured_location_address: model.manufactured_location_address || null,
            manufactured_location_address_obj: model.manufactured_location_address_obj || null
        };
        
        if (model.unit_length && model.unit_width && model.unit_height && model.unit_weight) {
            modelFormat.bottle_dimensions = 
                `Length: ${model.unit_length} inches | Width: ${model.unit_width} inches | Height: ${model.unit_height} inches | Weight: ${model.unit_weight} lbs`;
        }
        
        if (model.case_length && model.case_width && model.case_height && model.case_weight) {
            modelFormat.case_dimensions =
                `Length: ${model.case_length} inches | Width: ${model.case_width} inches | Height: ${model.case_height} inches | Weight: ${model.case_weight} lbs`;
        }
        
        if (model.pallet_length && model.pallet_width && model.pallet_height && model.pallet_weight) {
            modelFormat.pallet_dimensions =
                `Length: ${model.pallet_length} inches | Width: ${model.pallet_width} inches | Height: ${model.pallet_height} inches | Weight: ${model.pallet_weight} lbs`;
        }       
    
            if (model.bottle_dimensions == null) {
                delete modelFormat.bottle_dimensions;
            }
            if (model.case_dimensions == null) {
                delete modelFormat.case_dimensions;
            }
            if (model.pallet_dimensions == null) {
                delete modelFormat.pallet_dimensions;
            }
            if(modelFormat.prod_type){
            modelFormat.vintage =   Array.isArray(model.vintage) && model.vintage.length > 0  ? (model.vintage[0]?.id || null) 
            : model.vintage  || null,
            modelFormat.varietal =  Array.isArray(model.varietal) && model.varietal.length > 0  ? (model.varietal[0]?.id || null) 
            : model.varietal  || null,
            modelFormat.sub_type =   Array.isArray(model.sub_type) && model.sub_type.length > 0  ? (model.sub_type[0]?.id || null) 
            : model.sub_type  || null,
            modelFormat.category =  Array.isArray(model.category) && model.category.length > 0  ? (model.category[0]?.id || null) 
            : model.category  || null,
            
            modelFormat.source =  Array.isArray(model.source) && model.source.length > 0  ? (model.source[0]?.id || null) 
            : model.source  || null,
            modelFormat.country = Array.isArray(model.country) && model.country.length > 0  ? (model.country[0]?.id || null) 
            : model.country  || null,
            modelFormat.manufactured_location_address = model.manufactured_location_address || null,
            modelFormat.manufactured_location_address_obj = model.manufactured_location_address_obj ? model.manufactured_location_address_obj : null;
            }
            if(edit && !duplicate){
            modelFormat.id = id;
            modelFormat.temp_product_id = productId;
            modelFormat.product_id = productId;
            }
            if(duplicate){
                modelFormat.product_id = null
                modelFormat.temp_product_id = productId;  
            }
        
        return modelFormat;
    }
    
    /**
     * Formats an array of objects into a dropdown-compatible format.
     * 
     * @param values
     * @param name
     * @returns An array of objects suitable for use in a dropdown
     * @author psi-enhancement
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
     * @author psi-enhancement
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
     * @author psi-enhancement
     */
    getDropdown(token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.DROPDOWN, { headers }).toPromise();
    }
 
    /**
     * Retrieves the list of brands associated with the given client ID.
     * 
     * @param clientId The client ID for which to retrieve the associated brands.
     * @returns An Observable containing the data of brands.
     * @author psi-enhancement
     */
    getBrands(clientId: string) {
        const token = localStorage.getItem('authToken');
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }); 
        return this.http
            .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_TOOL_GET_BRANDS + `?client_id=${clientId}` , { headers })
            .pipe(map((response: any) => {return  response.data;
            })
        );
    }
 
    /**
     * Fetches the sub-brand products associated with the given client ID.
     * 
     * @param clientId
     * @returns An Observable containing the data of sub-brand products.
     * @author psi-enhancement
     */
    getSubBrandProducts(clientId: string , brandID: string) {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const params = new HttpParams()
            .set('client_id', clientId)
            .set('brand_id', brandID);
        return this.http
            .get( environment.apiUrl + AppRoutes.PRODUCT_TOOL.GET_SUB_BRAND_PRODUCT_WITH_CLIENT_ID , { headers, params })
            .pipe(map((response :any) => response.data));
    }

    /**
     * Retrieves the product details for a given product ID.
     *
     * @param id The ID of the product.
     * @returns An Observable containing the product details from the server.
     * @author psi-enhancement
     */
    getDetails(id) {
        return this.http
        .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.DETAILS + id)
        .pipe(map((response :any) => response.data));
    }

    /**
     * Retrieves the permission settings for the product tool.
     *
     * @returns A promise that resolves to the permission data from the server.
     * @author psi-enhancement
     */
    getPermission() {
        return this.http
        .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PERMISSION).toPromise();
    }

    /**
     * Syncs the product order with NS.
     * @param productId
     * @returns An Observable containing the response from the server.
     * @author psi-enhancement
     */
    syncOrder(productId) {
        let params = {
            'productId' : productId
        };
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.NS_SYNC, params)
            .pipe(map((response :any) => response.data));
    }

    /**
     * Retrieves the approval status of a product from the server.
     *
     * @param productId
     * @returns An Observable containing the API response for the approval status of the product.
     * @author psi-enhancement
     */
    getApproveAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
      
          const params = { product_id: productId };
      
          return this.http
          .get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_APPROVE, { headers, params,})
          .pipe(map((response :any) => response));
    }

    /**
     * Retrieves the Pre Approve API response from the server for a given product ID.
     *
     * @param productId
     * @returns An Observable containing the Pre Approve API response.
     * @author psi-enhancement
     */
    getPreApproveAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
      
        const params = { product_id: productId };
      
        return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_PRE_APPROVE, { headers, params,})
        .pipe(map((response :any) => response));
    }

    /**
     * Gets the Need Action API response from the server.
     *
     * @param productId
     * @returns An Observable containing the Need Action API response.
     * @author psi-enhancement
     */
    getNeedActionAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
    
        const params = { product_id: productId };
    
        return this.http.get(environment.apiUrl + AppRoutes.PRODUCT_TOOL.PRODUCT_NEED_ACTION, { headers, params,})
        .pipe(map((response :any) => response));
    }

    /**
     * Function to activate or deactivate a product.
     * @param productId
     * @param isActive
     * @returns Observable containing the response from the server.
     * @author psi-enhancement
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
        .pipe(map((response :any) => response));
    }

    /**
     * Makes an API call to export the given products to Excel.
     * @param obj
     * @returns An observable containing the HTTP response from the server.
     * @author psi-enhancement
     */
    excelExport(obj) {
        return this.http
            .post(environment.apiUrl + AppRoutes.PRODUCT_TOOL.EXCEL_EXPORT, obj,{responseType: 'text',observe: 'response'})
            .pipe(map((response :any) => response));
    }

    /**
     * Fetches the sync status details for a product
     * @param id
     * @returns An observable containing the sync status details
     * @author psi-enhancement
     */
    getSyncStatusDetails(id) {
        return this.http
            .get(environment.apiUrl +`product-tool/ns-sync-status?id=${id}`)
            .pipe(map((response :any) => response));
    }
}
