import { Component, Input, OnInit } from '@angular/core';
import { ProductManagementService } from '../product-management.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    actionButtons: any = 
    [
        { key:'Sync', showTooltip: true, icon: 'fas fa-sync-alt fa-spin', tooltipText: 'Sync' }, //need to update as per conditions
        { key: 'Approve', showTooltip: true, icon: 'fas fa-check-circle pointer', tooltipText: 'Approve'},        
        { key: 'Needs Action-Waiting on Supplier', icon: 'fas fa-clock', showTooltip: true, tooltipText: 'Needs Action-Waiting on Supplier'},
        { key: 'Pre-Approved', showTooltip: true, icon: 'fas fa-check-circle pointer', tooltipText: 'Pre-Approved'},
        { key: 'inactivate', icon: 'fas fa-ban', showTooltip: true, tooltipText: 'Deactivate' },
        { key: 'duplicate', icon: 'fas fa-clone', showTooltip: true, tooltipText: 'Duplicate' },
        { key: 'edit', icon: 'fas fa-pen', showTooltip: true, tooltipText: 'Edit' },
    ];

    constructor(
        private productManagementService: ProductManagementService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.IconHeaderStatus = 'Inactive';
        this.codesTitle = 'CODES';
        this.dimensionTitle = 'DIMENSIONS';
        const productId = this.route.snapshot.paramMap.get('id');
        this.tabGroupConfig = this.getTabGroupConfig()
        this.activeTab = this.tabGroupConfig[0].key
        // this.statusIcon = 'fas fa-ban u-mt1 u-ml2 neutral-light';
        this.productManagementService.getDetails(productId).subscribe((res: any) => {
            this.productDetails = res;
            this.detailProduct = this.fieldsDetail(res);
            this.productCodeDetail = this.prepareProductCodeDetails(res);
            this.productList = this.productFieldsDetail({ ...res });
            this.getStatusUpdate();
            this.headerTitle = this.productDetails.description;
        });


        
        this.getProductData(productId);

    }

    async getProductData(productId : string) {
        try {
            await this.productManagementService.getDetails(productId).subscribe((res: any) => {
                this.productDetails = res;
                this.detailProduct = this.fieldsDetail(res);
                this.productCodeDetail = this.prepareProductCodeDetails(res); 
                this.productList = this.productFieldsDetail({ ...res });
                this.getStatusUpdate();
                this.headerTitle = this.productDetails.description;
            });
          }
          catch (error) {
            console.error("Error fetching ProductData:", error);
          }
    }
    onClickAction(action) {
        console.log(action);
        if (action.key === 'Sync') {
            this.syncOrder();
        } else if (action.key === 'edit') {
            this.navigateToEdit();
        } else if (action.key === 'Approve') {
            this.getApproveAPI();
        }  else if (action.key === 'inactivate') {
            this.getInactiveAPI();
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

    syncOrder() {
        console.log("inside sync");
    }

    getApproveAPI() {
        console.log("call Approve API here");
    }
    getPreApproveAPI() {
        console.log("Call Pre-Approve API here");
    }

    getNeedActionAPI() {
        console.log("call get Need Action API here");
    }
    getInactiveAPI() {
        console.log("call get Inactive API here");
    }

    navigateToEdit() {
        if (this.productDetails.product_id) {
            const currentPath = this.route.snapshot.pathFromRoot
              .map(route => route.url.map(segment => segment.toString()).join('/'))
              .join('/');
            const editPath = `${currentPath}/edit`;

            this.router.navigate([editPath]);
        }
    }

    navigateToClone() {
        console.log("navigate to Clone as per Navigate to Edit");
    }
    onClickback() {
        this.router.navigate(['/product-management']);
    }
    getStatusUpdate() {
        this.status = this.productDetails.status;
        if (this.status === 'Approved') {
            this.statusClass = 'badge med base-success';
        } else if (this.status === 'Pending') {
            this.statusClass = 'badge med warning-staus';
        } else if (this.status === 'Pre-Approved') {
            this.statusClass = 'badge med u-bg-light-blue';
        } else if (this.status === 'Needs Action-Waiting on Supplier') {
            this.statusClass = 'badge med u-bg-orange';
        } else if (this.status === 'Request Received') {
            this.statusClass = 'badge med u-bg-light-gray';
        }
        // this.getAuditTrailData();
    }

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
    clickTabGroup(tab) {
        this.activeTab = tab.tab.key
    }
    fieldsDetail(row) {
        let response = [];
        if (row) {
            response.push({ label: 'Brand', value: this.valueChecker(row.brand) });
            response.push({
                label: 'Sub-Brand Product',
                value: this.valueChecker(row.sub_brand_product_name),
            });
            response.push({
                label: 'Fanciful Name',
                value: this.valueChecker(row.fanciful_name),
            });
            response.push({
                label: 'Group',
                value: this.valueChecker(row.group_name),
            });
            response.push({
                label: 'Producer',
                value: this.valueChecker(row.producer_name),
            });
            response.push({
                label: 'Case UOM',
                value: this.valueChecker(row.case_unit_of_measure),
            });
            response.push({
                label: 'Container Type',
                value: this.valueChecker(row.container_type_name),
            });
            response.push({
                label: 'Announced Price',
                value: this.valueChecker(row.ex_works_cost_formatted),
            });
            response.push({
                label: 'Organic',
                value: this.valueChecker(row.is_organic_txt),
            });
            response.push({
                label: 'Product Type',
                value: this.valueChecker(row.prod_type),
            });
            response.push({
                label: 'Compliance',
                value: this.valueChecker(row.compliance_txt),
            });
            response.push({
                label: 'Use Up',
                value: this.valueChecker(row.use_up_txt),
            });
            response = this.fieldsDetailResponse(row, response);
        }
        return response;
    }

    fieldsDetailResponse(row, response) {
        response.push({ label: 'Product Sub-Type', value: this.valueChecker(row.sub_type) });
        response.push({ label: 'Date Created', value: this.valueChecker(row.created_date) });
        response.push({ label: 'Category', value: this.valueChecker(row.category_name) });
        response.push({ label: 'Source', value: this.valueChecker(row.source) });
        response.push({ label: 'Country of Origin', value: this.valueChecker(row.country_name) });
        response.push({ label: 'Manufactured Location', value: this.valueChecker(row.manufactured_location_address) });
        this.fieldsDetailResponseCheck(row, response);
        return response;
    }

    fieldsDetailResponseCheck(row, response) {
        response.push({ label: 'Vintage', value: this.valueChecker(row.vintage_text) });
        response.push({ label: 'Varietal', value: this.valueChecker(row.varietal) });
        response.push({ label: 'ABV %', value: this.valueChecker(row.abv, 'abv') });
        return response;
    }

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


    prepareProductCodeDetails(detail: any = {}) {
        return [
            { label: 'Park Street Product Code', val: detail.product_id || '--' },
            { label: 'COLA TTB', val: detail.cola_ttb_id || '--' },
            { label: 'UPC Code', val: detail.upc_code || '--' },
            { label: 'SCC Code', val: detail.scc_code || '--' },
            { label: 'Supplier Reference ID', val: detail.supplier_ref_id || '--' },
            { label: 'NABCA Code', val: detail.nabca_code || '--' },
            { label: 'UNIMERC Code', val: detail.unimerc_code || '--' },
            { label: 'BDN Code', val: detail.bdn_code || '--' }
        ];
    }

    productFieldsDetail(row) {
        let response = [];
        let obj = {}
        let productData = [];
        if (!row) return response;
        if (row.dimensions && row.dimensions[0] && row.dimensions[0].desc) {
            for (let i = 0; i < row.dimensions.length; i++) {
                obj = this.productFieldsDetailObj(row, productData, obj, i);
                response.push(obj);
            }
        }
        return response;
    }
    productFieldsDetailObj(row, productData, obj, i) {
        if (row.dimensions[i].desc !== "Layer") {
            obj = {
                column1: 'Length',
                value1: this.valueChecker(row.dimensions[i].length),
                hideColumn1: false,
                column2: 'Width',
                value2: this.valueChecker(row.dimensions[i].width),
                hideColumn2: false,
                column3: 'Height',
                value3: this.valueChecker(row.dimensions[i].height),
                hideColumn3: false,
                column4: 'Weight',
                value4: this.valueChecker(row.dimensions[i].weight),
                hideColumn4: false,
                hideColumn5: true,
                products: productData,
                cardHeader: row.dimensions[i].desc === 'Unit' ? 'Bottle / Unit' : row.dimensions[i].desc,
                headerClass: 'h-l',
                headerAl: 'tx-s',
                showHeader: true,
                status: '',
            }
        } else {
            obj = {
                column1: 'Layers per Pallet',
                value1: this.valueChecker(row.dimensions[i].layers_per_pallet),
                hideColumn1: false,
                column2: 'Cases per Layer',
                value2: this.valueChecker(row.dimensions[i].cases_per_layer),
                hideColumn2: false,
                column3: 'Cases per Pallet',
                value3: this.valueChecker(row.dimensions[i].cases_per_pallet),
                hideColumn3: false,
                hideColumn4: true,
                hideColumn5: true,
                products: productData,
                cardHeader: row.dimensions[i].desc === 'Unit' ? 'Bottle / Unit' : row.dimensions[i].desc,
                headerClass: 'h-l',
                headerAl: 'tx-s',
                showHeader: true,
                status: ''
            }
        }
        return obj;
    }
}
