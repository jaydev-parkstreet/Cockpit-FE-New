import { Component, Input, OnInit } from '@angular/core';
import { ProductManagementService } from '../product-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { ProductMangementDetailService } from './product-mangement-detail.service';
import AppConstant from 'src/app/app.constant';

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
                this.productCodeDetail = this.getProductCodeDetails(res); 
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
        if (this.productDetails.sync_status === 1 || this.productDetails.sync_status === 2 || this.actionButtons[0].button === AppConstant.PRODUCT.SYNC_STATUS[2]) {
            return false;
        }
        this.actionButtons[0].class = 'fas fa-sync fa-spin';
        this.actionButtons[0].button = AppConstant.PRODUCT.SYNC_STATUS[2];
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
                        this.commonService.showToastV2Message(true, 'Sync Successful', 'fas fa-exclamation-circle', 'success');
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
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
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
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
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
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
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
                this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle', 'success');
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
            this.statusClass = 'badge med u-bg-success';
        } else if (this.status === 'Pending') {
            this.statusClass = 'badge med u-bg-warning';
        } else if (this.status === 'Pre-Approved') {
            this.statusClass = 'badge med u-bg-primary';
        } else if (this.status === 'Needs Action-Waiting on Supplier') {
            this.statusClass = 'badge med u-bg-warinig-medium';
        } else if (this.status === 'Request Received') {
            this.statusClass = 'badge med u-bg-neutral-light';
        }
    }

    /**
     * Returns the configuration for the tab group, including keys and labels.
     *
     * @returns {Array} An array of tab configuration objects, each containing a key and label for the tab.
     * @author PSI-Enhancement
     */
    getTabGroupConfig() {
        return this.productManagementDetailService.getTabGroupConfig();
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
     * Get product fields to get a response array with corresponding labels and values.
     *
     * @param {Object} row - The row of product data.
     * @returns {Array} The response array with labels and formatted values for the fields.
     * @author PSI-Enhancement
     */
    fieldsDetail(row) {
        return this.productManagementDetailService.getFieldsDetail(row);
    }

    /**
     * Get the product code details for display by organizing the fields into a table format.
     *
     * @param {Object} productDetails - The details of the product.
     * @returns {Array} A configuration object containing the table headings and values of product code details.
     * @author PSI-Enhancement
     */
    getProductCodeDetails(productDetails) {
        return this.productManagementDetailService.prepareProductCodeDetails(productDetails);
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
                        rowConfig.headerName = (value === 'Unit') ? "Bottle / Unit" : this.productManagementDetailService.formatKey(value);
                    } else {
                        rowConfig.table_headings.push({
                            key,
                            value: this.productManagementDetailService.formatKey(key)
                        });
                        table_values_row_array.push(this.productManagementDetailService.valueChecker(value));
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
        return this.productManagementDetailService.getActionButtons(permissions, detail);
    }
}
