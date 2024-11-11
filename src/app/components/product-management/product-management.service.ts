import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InputDropdownService } from 'src/app/shared/components/cmp-input-dropdown/input-dropdown.service';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';

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
  
    renderDash(params) {
        if (params.value) {
            return `<div class="text-ellipsis"><span>${params.value}</span>
                    <span class="add-tooltip">${params.value}</span></div>`;
        }
        return '--';
    }
  
    renderId(params) {
      if (params.value) {
        return `<a target="_blank" style="color: black;text-decoration: none;" onmouseover="this.style.textDecoration='underline'"
                onmouseout="this.style.textDecoration='none'" href="product-management/${params.value}">${params.value}</a>`;
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

    getTopPanelConfig(isActive = false) {
        return {
            placeholder: 'Search',
            searchText: '',
            searchOptions: {},
            showFilter: false,
            totalResult: 0,
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
                    permission: true,
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: 'Attach',
                    icon: 'fas fa-paperclip',
                    key: 'attachment',
                    permission: true
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: 'Note',
                    icon: 'fas fa-comment',
                    key: 'notes',
                    permission: true
                  }, {
                    type: 'icon',
                    showTooltip: true,
                    tooltipText: isActive ? 'Activate' : 'Deactivate',
                    icon: isActive ? 'fas fa-check-circle' : 'fas fa-times-circle',
                    key: 'active',
                    isActive,
                    permission: true
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
   
  formatModelProductTool(model: any, filtersList: any, subBrandProducts: any[], edit: boolean, duplicate:boolean , id: number,productId:any): any {
        if (!Object.keys(model).length) {
            return {};  
        }    
        let modelFormat: any = {
            compliance: model.compliance === true ? 1 : 1,
            use_up: model.use_up === true ? 1 : 0,  
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
            sub_brand_product_name: subBrandProducts[0]?.name || "",   
            sub_brand_product_id: subBrandProducts[0]?.id|| null,         
            name: model.name || "",
            group: Array.isArray(model.group) && model.group.length > 0  ? (model.group[0].id || null) 
            : model.group  || null,       
            producer: model.producer ? model.producer.trim() : null,         
            case_unit_of_measure: Array.isArray(model.case_unit_of_measure) && model.case_unit_of_measure.length > 0 
            ? (model.case_unit_of_measure[0].id || null) 
            : model.case_unit_of_measure || null,
            container_type: Array.isArray(model.container_type) && model.container_type.length > 0 
            ? (model.container_type[0].id || null) 
            : model.container_type || null,
            ex_works_cost: model.ex_works_cost || "",      
            prod_type: Array.isArray(model.prod_type) && model.prod_type.length > 0  ? (model.prod_type[0].id || null) 
            : model.prod_type  || null, 
            sub_type: model.sub_type || "",       
          //  clone: model.clone || 0,
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
            modelFormat.vintage =  model.vintage || null,
            modelFormat.varietal = model.varietal || null,
            modelFormat.sub_type =  model.sub_type || null,
            modelFormat.category =  model.category || null,
            
            modelFormat.source = model.source || null,
            modelFormat.country = Array.isArray(model.country) && model.country.length > 0  ? (model.country[0].id || null) 
            : model.country  || null,
            modelFormat.producer = model.producer || null,
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
   
    getSummary(summaryData: any, token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(environment.apiUrl + "product-tool/summary", summaryData, { headers }).toPromise();
    }

    getDropdown(token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(environment.apiUrl + "product-tool/dropdown", { headers }).toPromise();
    }
 
    getBrands(clientId: string) {
        const token = localStorage.getItem('authToken');
    
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }); 
        return this.http
            .get(environment.apiUrl + "product-tool/get-brands-client" + `?client_id=${clientId}` , { headers })
            .pipe(map((response: any) => {return  response.data;
            })
        );
}
    
    
    getSubBrandProducts(clientId: string,brandId) {
        const token = localStorage.getItem('authToken');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
            .get(`${environment.apiUrl}product-tool/get-sub-brands-client?client_id=${clientId}&brand_id=${brandId}`, { headers })
            .pipe(map((response :any) => response.data));
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

    syncOrder(productId) {
        let params = {
            'productId' : productId
        };
        return this.http
            .post(environment.apiUrl +"product-tool/ns-sync", params)
            .pipe(map((response :any) => response.data));
    }

    getApproveAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
      
          const params = { product_id: productId };
      
          return this.http
          .get(environment.apiUrl + "product-tool/approve/product", { headers, params,})
          .pipe(map((response :any) => response));
    }

    getPreApproveAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
      
        const params = { product_id: productId };
      
        return this.http.get(environment.apiUrl + "product-tool/pre-approve/product", { headers, params,})
        .pipe(map((response :any) => response));
    }

    getNeedActionAPI(productId) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
    
        const params = { product_id: productId };
    
        return this.http.get(environment.apiUrl + "product-tool/need-action-waiting-on-client/product", { headers, params,})
        .pipe(map((response :any) => response));
    }

    getActivateAPI(productId: string[], isActive) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });
      
        const body = {
        product_id: productId,
        is_active: isActive ? 0 : 1,
        };

        return this.http
        .post(environment.apiUrl + "product-tool/active-deactivate/product", body, { headers })
        .pipe(map((response :any) => response));
    }

    getProductManagementSystemSave(obj) {
        return this.http
            .post(environment.apiUrl + "product-tool/save", obj)
            .pipe(map((response :any) => response));
    }
    excelExport(obj) {
        return this.http
            .post(environment.apiUrl + "product-tool/excel-export", obj,{responseType: 'text',observe: 'response'})
            .pipe(map((response :any) => response));
    }

    getSyncStatusDetails(id) {
        return this.http
            .get(environment.apiUrl +`product-tool/ns-sync-status?id=${id}`)
            .pipe(map((response :any) => response));
    }
}
