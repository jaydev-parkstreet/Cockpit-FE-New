import { Component, Input, OnInit } from '@angular/core';
import { ProductManagementService } from '../product-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductMangementDetailService } from './product-mangement-detail.service';

@Component({
    selector: 'app-product-management-details',
    templateUrl: './product-management-details.component.html',
    styleUrls: ['./product-management-details.component.scss'],
})
export class ProductManagementDetailsComponent implements OnInit {
    statusClass: any;
    headerTitle: any;
    status: any;
    statusIcon: any;
    IconHeaderStatus: any;
    codesTitle: string;
    dimensionTitle: string;
    productCodeDetail: any;
    productList: any[];
    tabGroupConfig: { key: string; label: string; }[];
    activeTab: string;
    sync_status = 1;
    productDetails: any;
    detailProduct: any;
    actionButtons: any = [];
    SYNC_STATUS: any = {
        1: 'Synced',
        2: 'Syncing',
        3: 'Sync',
        4: 'Sync'
    }
    syncStatusFail: boolean;
    timerObj: any;
    permissions: any;
    backToProductsTitle: string = 'Back to Products';

    constructor(
        private productManagementService: ProductManagementService,
        private productManagementDetailService: ProductMangementDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private spinner :NgxSpinnerService,
        private commonService : CommonService
    ) { }

    ngOnInit(): void {
        this.permissions = this.route.snapshot.data['permissions'];
        this.IconHeaderStatus = 'Inactive';
        this.codesTitle = 'CODES';
        this.dimensionTitle = 'DIMENSIONS';
        const productId = this.route.snapshot.paramMap.get('id');
        this.tabGroupConfig = this.getTabGroupConfig();
        this.activeTab = this.tabGroupConfig[0].key;
        this.getProductData(productId);
    }

    /**
     * Function to get product data
     * 
     * @param productId 
     * @returns void
     * @author PSI-Enhancement
     */
    async getProductData(productId : string) {
        try {
            await this.productManagementService.getDetails(productId).subscribe((res: any) => {
                this.productDetails = res;
                this.detailProduct = this.fieldsDetail(res);
                this.productCodeDetail = this.prepareProductCodeDetails(res); 
                this.productList = this.productFieldsDetail({ ...res });
                this.getStatusUpdate();
                this.getSyncStatusUpdate();
                this.actionButtons = this.getactionButtons(this.permissions ,this.productDetails);
                this.headerTitle = this.productDetails.description;
            });
          }
          catch (error) {
            console.error("Error fetching ProductData:", error);
          }
    }

    /**
     * Checks the synchronization status of a product and sets up periodic status updates.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getSyncStatusUpdate() {
        if (this.productDetails.sync_status === 2) {
            this.timerObj = setInterval(() => {
                this.getSyncStatusDetails();
            }, 30000);
        } else if (this.productDetails.sync_status === 3 || this.productDetails.sync_status === null) {
            this.syncStatusFail = true;
        }
    }

    /**
     * Handles the click event for performing an action.
     *
     * @param string
     * @returns {boolean | void}
     * @author PSI-Enhancement
     */
    onClickAction(action) {
        if (action.key === 'Sync') {
            this.syncOrder();
        } else if (action.key === 'edit') {
            this.navigateToEdit();
        } else if (action.key === 'Approve') {
            this.getApproveAPI();
        }  else if (action.key === 'Activate') {
            this.getActivateAPI();
        } else if (action.key === 'Pre-Approved') {
            this.getPreApproveAPI();
        } else if (action.key === 'Needs Action-Waiting on Supplier') {
            this.getNeedActionAPI();
        } else if (action.key === 'duplicate') {
            this.navigateToClone();
        }
        else{
            return true;
        }
    }

    /**
     * Synchronizes the order data with the server.
     *
     * @returns {boolean}
     * @author PSI-Enhancement
     */
    syncOrder() {
        if (this.productDetails.sync_status === 1 || this.productDetails.sync_status === 2 || this.actionButtons[0].button === this.SYNC_STATUS[2]) {
            return false;
        }
        this.actionButtons[0].class = 'fas fa-sync fa-spin';
        this.actionButtons[0].button = this.SYNC_STATUS[2];
        this.productManagementDetailService.syncOrder(this.productDetails.id).subscribe( (result) =>{
            this.timerObj= setInterval(() => {
                this.getSyncStatusDetails();
            }, 30000);
        });
        return true;
    }

    /**
     * Fetches the synchronization status details for a product.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getSyncStatusDetails() {
        this.productManagementDetailService.getSyncStatusDetails(this.productDetails.product_id).subscribe(response => {
            if (!response.hasError) {
                if (response.data) {
                    this.productDetails.sync_status = response.data.status
                    if (response.data.status === 1) {
                        this.commonService.showToastV2Message(true, 'Sync Successful', 'fas fa-exclamation-circle');
                        clearInterval(this.timerObj);
                        this.timerObj = null;
                        this.syncStatusFail = false;
                    } else if (response.data.status === 3) {
                        this.commonService.showToastV2Message(true, 'Sync Failed', 'fas fa-exclamation-circle');
                        this.syncStatusFail = true;
                        clearInterval(this.timerObj);
                        this.timerObj = null;
                        this.getProductData(this.productDetails.product_id);
                    }
                    this.actionButtons = this.getactionButtons(this.permissions, this.productDetails);
                } else {
                    this.syncStatusFail = true;
                    clearInterval(this.timerObj);
                    this.timerObj = null;
                    this.getProductData(this.productDetails.product_id);
                }
            } else {
                this.syncStatusFail = true;
                clearInterval(this.timerObj);
                this.timerObj = null;
                this.getProductData(this.productDetails.product_id);
            }
        });
    }

    /**
     * Fetches the "Approve" API data for a product and updates the product data.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getApproveAPI() {
        this.spinner.show();
        this.productManagementDetailService.getApproveAPI(this.productDetails.product_id).subscribe(response => {
            this.spinner.hide();
            if (!response.hasError) {
                this.getProductData(this.productDetails.product_id);
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            }
        });
    }

    /**
     * Fetches the "Pre-Approve" API data for a product and updates the product data.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getPreApproveAPI() {
        this.spinner.show();
        this.productManagementDetailService.getPreApproveAPI(this.productDetails.product_id).subscribe((response) => {
            this.spinner.hide();
            if (!response.hasError) {
                this.getProductData(this.productDetails.product_id);
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            }
        });
    }

    /**
     * Fetches the "Need Action" API data for a product and updates the product data.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getNeedActionAPI() {
        this.spinner.show();
        this.productManagementDetailService.getNeedActionAPI(this.productDetails.product_id).subscribe((response) => {
            this.spinner.hide();
            if (!response.hasError) {
                this.getProductData(this.productDetails.product_id);
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            }
        });
    }

    /**
     * Activates or deactivates a product via an API call and updates the product data.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getActivateAPI() {
        this.spinner.show();
        this.productManagementService.getActivateAPI([this.productDetails.product_id], this.productDetails.is_active).subscribe((response) => {
            this.spinner.hide();
            if (!response.hasError) {
                this.getProductData(this.productDetails.product_id);
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            } else {
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
            }
        });
    }

    /**
     * Navigates to the product edit page based on the current route if a product ID is present.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    navigateToEdit() {
        if (this.productDetails.product_id) {
            const currentPath = this.route.snapshot.pathFromRoot
              .map(route => route.url.map(segment => segment.toString()).join('/'))
              .join('/');
            const editPath = `${currentPath}/edit`;

            this.router.navigate([editPath]);
        }
    }

    /**
     * Navigates to the product clone page based on the current route if a product ID is present.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    navigateToClone() {
        if (this.productDetails.product_id) {
            const currentPath = this.route.snapshot.pathFromRoot
              .map(route => route.url.map(segment => segment.toString()).join('/'))
              .join('/');
            const clonePath = `${currentPath}/clone`;

            this.router.navigate([clonePath]);
        }
    }

    /**
     * Navigates to the product management page when the back button is clicked.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    onClickback() {
        this.router.navigate(['/product-management']);
    }

    /**
     * Updates the status and assigns the corresponding CSS class based on the product's status.
     *
     * @returns {void}
     * @author PSI-Enhancement
     */
    getStatusUpdate() {
        this.status = this.productDetails.status;
        if (this.status === 'Approved') {
            this.statusClass = 'badge med u-bg-v2-base-success';
        } else if (this.status === 'Pending') {
            this.statusClass = 'badge med u-bg-v2-base-warinig';
        } else if (this.status === 'Pre-Approved') {
            this.statusClass = 'badge med u-bg-v2-base-primary';
        } else if (this.status === 'Needs Action-Waiting on Supplier') {
            this.statusClass = 'badge med u-bg-v2-base-warinig-v-low';
        } else if (this.status === 'Request Received') {
            this.statusClass = 'badge med u-bg-v2-neutral-light';
        }
    }

    /**
     * Returns the configuration for the tab group, including keys and labels.
     *
     * @returns {Array} An array of tab configuration objects, each containing a key and label for the tab.
     * @author PSI-Enhancement
     */
    getTabGroupConfig() {
        const tabConfig = [{
            key: 'notes',
            label: 'Notes'
        }, {
            key: 'attachments',
            label: 'Attachments'
        }, {
            key: 'auditTrail',
            label: 'Audit Trail'
        }];
        return tabConfig;
    }

    /**
     * Sets the active tab based on the selected tab.
     *
     * @param {Object} tab - The selected tab object.
     * @returns {void}
     * @author PSI-Enhancement
     */
    clickTabGroup(tab) {
        this.activeTab = tab.key
    }

    /**
     * Maps and processes product fields to generate a response array with corresponding labels and values.
     *
     * @param {Object} row - The row of product data.
     * @returns {Array} The response array with labels and formatted values for the fields.
     * @author PSI-Enhancement
     */
    fieldsDetail(row) {
        if(!row) return [];
        let fieldMappings = [
            { label: 'Supplier', key: 'client_name' },
            { label: 'Brand', key: 'brand' },
            { label: 'Sub-Brand Product', key: 'sub_brand_product_name' },
            { label: 'Description', key: 'description' },
            { label: 'Fanciful Name', key: 'fanciful_name' },
            { label: 'Group', key: 'group_name' },
            { label: 'Producer', key: 'producer_name' },
            { label: 'Case UOM', key: 'case_unit_of_measure' },
            { label: 'Container Type', key: 'container_type_name' },
            { label: 'Announced Price', key: 'ex_works_cost_formatted' },
            { label: 'Organic', key: 'is_organic_txt' },
            { label: 'Product Type', key: 'prod_type' },
            { label: 'Compliance', key: 'compliance_txt' },
            { label: 'Use Up', key: 'use_up_txt' }
        ];

        let response = fieldMappings.map(({ label, key }) => ({
            label,
            value: this.valueChecker(row[key])
        }));

        response = this.fieldsDetailResponse(row, response);
        response.push({ label: 'Date Created', value: this.valueChecker(row.created_date) });

        return response;
    }

    /**
     * Processes the product details and adds relevant fields to the response array 
     * based on the product type and its attributes.
     *
     * @param {Object} row - The row of product data.
     * @param {Array} response - The array to which the product details will be added.
     * @returns {Array} The updated response array with the relevant product details.
     * @author PSI-Enhancement
     */
    fieldsDetailResponse(row, response) {
        const prodTypeSubType = ['Bulk', 'Other', 'Wine', 'Malt', 'Spirits'];
        const prodTypeCategory = ['Wine', 'Spirits', 'Malt'];

        if(prodTypeSubType.includes(row.prod_type)) {
            response.push({
                label: 'Product Sub-Type',
                value: this.valueChecker(row.sub_type)
            });
        }

        if(prodTypeCategory.includes(row.prod_type)) {
            response.push({ 
                label: 'Category',
                value: this.valueChecker(row.category_name) 
            });
            response.push({ 
                label: 'Source',
                value: this.valueChecker(row.source) 
            });
            response.push({ 
                label: 'Country of Origin',
                value: this.valueChecker(row.country_name) 
            });
        }

        response.push({ 
            label: 'Manufactured Location',
            value: this.valueChecker(row.manufactured_location_address) 
        });

        response = this.fieldsDetailResponseCheck(row, response);
        return response;
    }

    /**
     * Checks the product type and adds relevant details to the response array.
     * 
     * @param {Object} row - The row of product data.
     * @param {Array} response - The array to which details will be added.
     * @returns {Array} The updated response array with the relevant product details.
     * @author PSI-Enhancement
     */
    fieldsDetailResponseCheck(row, response) {
        if (row.prod_type === 'Wine' || row.prod_type === 'Malt') {
            response.push({ 
                label: 'Vintage',
                value: this.valueChecker(row.vintage_text)
            });
        }

        if (row.prod_type === 'Wine') {
            response.push({ 
                label: 'Varietal',
                value: this.valueChecker(row.varietal)
            });
        }

        if (row.prod_type === 'Wine' || row.prod_type === 'Spirits' || row.prod_type === 'Malt') {
            response.push({ 
                label: 'ABV %',
                value: this.valueChecker(row.abv, 'abv')
            });
        }

        return response;
    }

    /**
     * Checks and formats a value based on its content and an optional key.
     *
     * @param {string|number} value - The value to be checked and formatted.
     * @param {string} [key=''] - The optional key to determine if special formatting is required (e.g., 'abv').
     * @returns {string} The formatted value or '--' if the value is invalid.
     * @author PSI-Enhancement
     */
    valueChecker(value, key = '') {
        if (value && value !== '-') {
            if (key && key === 'abv') {
                return value + '%';
            } else {
                return value;
            }
        } else {
            return '--';
        }
    }

    /**
     * Prepares the product code details for display by organizing the fields into a table format.
     *
     * @param {Object} productDetails - The details of the product.
     * @param {string} productDetails.product_id - The product ID.
     * @param {string} productDetails.cola_ttb_id - The COLA TTB ID.
     * @param {string} productDetails.upc_code - The UPC code.
     * @param {string} productDetails.scc_code - The SCC code.
     * @param {string} productDetails.supplier_ref_id - The supplier reference ID.
     * @param {string} productDetails.nabca_code - The NABCA code.
     * @param {string} productDetails.unimerc_code - The UNIMERC code.
     * @param {string} productDetails.bdn_code - The BDN code.
     * @returns {Array} A configuration object containing the table headings and values of product code details.
     * @author PSI-Enhancement
     */
    prepareProductCodeDetails(productDetails) {
        const productCodeDetailFields = [
            { label: 'Park Street Product Code', val: productDetails.product_id || '--' },
            { label: 'COLA TTB', val: productDetails.cola_ttb_id || '--' },
            { label: 'UPC Code', val: productDetails.upc_code || '--' },
            { label: 'SCC Code', val: productDetails.scc_code || '--' },
            { label: 'Supplier Reference ID', val: productDetails.supplier_ref_id || '--' },
            { label: 'NABCA Code', val: productDetails.nabca_code || '--' },
            { label: 'UNIMERC Code', val: productDetails.unimerc_code || '--' },
            { label: 'BDN Code', val: productDetails.bdn_code || '--' }
        ];
    
        const productCodeDetailsConfig = [{
            table_headings: [
                { value: 'Type' },
                { value: 'Code' }
            ],
            table_values: productCodeDetailFields.map(field => [field.label, this.valueChecker(field.val)])
        }];

        return productCodeDetailsConfig;
    }
    
    /**
     * Processes the rows of data and formats them into a configuration for displaying product dimensions.
     *
     * @param {Object} rows - The rows of data to be processed.
     * @param {Array} rows.dimensions - An array of dimensions for the product.
     * @returns {Array} An array of configuration objects for each dimension, with headings and values formatted.
     * @author PSI-Enhancement
     */
    productFieldsDetail(rows) {
        if(!rows) return [];
        let dimensionsDataConfig = [];

        if(rows.dimensions) {
            rows.dimensions.forEach((row: any) => {
                let rowConfig: any = {
                    table_headings: [],
                    table_values: []
                };
                let table_values_row_array = [];
                
                Object.entries(row).forEach(([key, value]) => {
                    if (key === 'desc') {
                        rowConfig.headerName = (value === 'Unit') ? "Bottle / Unit" : this.formatKey(value);
                    } else {
                        rowConfig.table_headings.push({
                            key,
                            value: this.formatKey(key)
                        });
                        table_values_row_array.push(this.valueChecker(value));
                    }
                });
                rowConfig.table_values.push(table_values_row_array);
                dimensionsDataConfig.push(rowConfig);
            });
        }
        return dimensionsDataConfig;
    }

    /**
     * Function to get action buttons.
     *
     * @param {object} permissions 
     * @param {object} detail 
     * @returns {object} button-config
     * @author PSI-Enhancement
     */
    getactionButtons(permissions, detail) {
        let syncbtnName = '';
        if (!detail.sync_status) {
            syncbtnName = this.SYNC_STATUS[3];
        } else {
            syncbtnName = this.SYNC_STATUS[detail.sync_status];
        }
        let data = [];
        if (detail.status !== 'Approved' &&
            detail.status !== 'Needs Action-Waiting on Supplier') {
            data.push({
                key: 'Needs Action-Waiting on Supplier',
                icon: 'fas fa-clock',
                showTooltip: true,
                tooltipText: 'Needs Action-Waiting on Supplier',
                permission: permissions.permissions.Update
                });
        }
        if (detail.status === 'Approved') {
            let syncClass = detail.sync_status === 1 ? 'fas fa-sync-alt' : 'fas fa-sync-alt pointer';
            data.push({
              key: 'Sync',
              showTooltip: true,
              icon: (detail.sync_status === 2 ? 'fas fa-sync-alt fa-spin' :syncClass ),
              tooltipText: syncbtnName,
              permission: permissions.permissions.Update
            });
        } else if (detail.status === 'Request Received' ||
            detail.status === 'Needs Action-Waiting on Supplier' ||
            detail.status === 'Pending') {
            data.push({
              key: 'Pre-Approved',
              showTooltip: true,
              icon: 'fas fa-check-circle pointer',
              tooltipText: 'Pre-Approved',
              permission: permissions.permissions.Update
            });
        } else {
            data.push({
              key: 'Approve',
              showTooltip: true,
              icon: 'fas fa-check-circle pointer',
              tooltipText: 'Approve',
              permission: permissions.permissions.Update
            });
        }
        {
            data.push(
              {
                key: 'edit',
                icon: 'fas fa-pen',
                showTooltip: true,
                tooltipText: 'Edit',
                permission: permissions.permissions.Update
              },
              {
                key: 'duplicate',
                icon: 'fas fa-clone',
                showTooltip: true,
                tooltipText: 'Duplicate',
                permission: permissions.permissions.Create
              }
            ); 
        }
            data.push({
                key:'Activate',
                icon:detail.is_active !== 1 ? 'fas fa-check-circle':'fas fa-times-circle',
                button: detail.is_active !== 1 ? 'Activate' : 'Deactivate',
                showTooltip: true, 
                tooltipText: detail.is_active !== 1 ? 'Activate' : 'Deactivate',
                permission: permissions.permissions.Update
            })
        return data;
    }

    /**
     * Formats a given key by replacing underscores with spaces and capitalizing each word.
     *
     * @param {string} key 
     * @returns {string}
     * @author PSI-Enhancement
     */
    formatKey(key) {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }
}
