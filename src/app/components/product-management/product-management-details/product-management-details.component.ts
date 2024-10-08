import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from '../product-management.service';

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
    constructor(private productManagementService: ProductManagementService) { }
    sync_status = 1;
    productDetails: any;
    detailProduct: any;
    actionButtons: any = [
        {
            name: 'Needs Action-Waiting on Supplier',
            icon: 'fas fa-clock',
            isDisable: false,
            showTooltip: true,
            class: 'fas fa-clock',
            button: 'Needs Action-Waiting on Supplier',
            tooltipText: 'Needs Action-Waiting on Supplier',
        },
        {
            name: 'Pre-Approved',
            class: 'fas fa-check-circle pointer',
            showTooltip: true,
            isDisable: false,
            icon: 'fas fa-check-circle pointer',
            button: 'Pre-Approved',
            tooltipText: 'Pre-Approved',
        },
        {
            name: 'Approve',
            class: 'fas fa-check-circle pointer',
            showTooltip: true,
            isDisable: false,
            icon: 'fas fa-check-circle pointer',
            button: 'Approve',
            tooltipText: 'Approve',
        },
        {
            name: 'Edit',
            class: 'fas fa-pen pointer',
            showTooltip: true,
            isDisable: false,
            icon: 'fas fa-pen pointer',
            button: 'Edit',
            tooltipText: 'Edit',
        },
        {
            name: 'Clone',
            icon: 'fas fa-copy',
            class: 'fas fa-copy',
            showTooltip: true,
            isDisable: false,
            button: 'Duplicate',
            tooltipText: 'Duplicate',
        },
    ];

    ngOnInit(): void {
        this.IconHeaderStatus = 'Inactive';
        this.codesTitle = 'CODES';
        this.dimensionTitle = 'DIMENSIONS';
        this.statusIcon = 'fas fa-ban u-mt1 u-ml2 neutral-light';
        this.productManagementService.getDetails('2XL-KITTY-750').subscribe((res: any) => {
            console.log(res);
            this.productDetails = res;
            this.detailProduct = this.fieldsDetail(res);
            this.productCodeDetail = this.prepareProductCodeDetails(res); 
            console.log(this.detailProduct);
            this.getStatusUpdate();
            // this.status = this.productDetails.status
            this.headerTitle = this.productDetails.description;
        });
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
}
