import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './product-management.service';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],

 
})
export class ProductManagementComponent implements OnInit {
  reportRequestObj: any = {};
  summaryResponse: any;
  dropdownData: any;
  gridOptions: any;
  selectedAllRows: boolean;
  selectedRowCount: number;
  selectedRows: any;
  selectedCardRows: any;
  mixType: boolean;
  isLoadingSummaryData: boolean = false;
  productToolSummary: any;
  productToolCardSummary: any;
  hasMoreRecords: boolean;
  isLoading: boolean;
  busy: boolean;
  isGridSortApplied: boolean;
  params: any;
  colDefs: any;
  columnDefs: any = [];
  rowData: any[] = [];
  filters: any;
  permissionObj: any;
  isSorting: boolean;
  scrollDisabled: boolean;
  topPanelConfig:any

  constructor(private productManagementService: ProductManagementService,
    private authService: AuthService, private router: Router, private spinner :NgxSpinnerService) { }

  ngOnInit(): void {
    // this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();

      
    }, 2000);

    // this.spinner.hide();
   
    this.getDropdown();
    this.topPanelConfig = this.productManagementService.getTopPanelConfig();

    //Angular 10 appproach------------


    // --------------------------
    // this.getSummaryData();
    // this.getDropdown();
    // this.loadGridData();
    this.reportRequestObj = {};
    this.selectedRowCount = 0;
    // this.selectedCardRowCount = 0;
    this.productToolCardSummary = [];
    // this.selectedAll = false;
    this.busy = true;
    this.filters = {};
    this.permissionObj = {};
    this.isSorting = false;
    this.scrollDisabled = false;
    // this.queryParam = this.commonService.$location.search();
    // this.openNotePopup = false;
    // this.defaultState = this.productToolService.getDefaultState()[0].id;
    // this.reportRequestObj = {
    //     page: 1,
    //     pageSize: 25,
    //     sort: 'status',
    //     order: 'desc',
    //     active_status: [this.defaultState]
    // };
    // this.summaryTopBarConfig = this.productToolService.getSummaryTopBarConfig();
    // this.summaryTopBarConfig.actions = this.productToolService.getDefaultActions(this.reportRequestObj,
    //     this.permissions.permissions.Create);
    // this.statusObj = this.productToolService.getStatusObject();
    this.initGridOptions();
  }


  initGridOptions() {
    this.gridOptions = this.productManagementService.getGridOption();
    this.gridOptions.onGridReady = () => {
      this.setDataSourceAgGrid();
    };
  }

  /**
     * Function to get summary data
     *
     * @createdDate 03-08-2024
     * @author PSI-Enhancements
    */
  async getSummaryData() {
    this.spinner.show();
    const token = localStorage.getItem('authToken');
    const summaryData = {
      "page": this.reportRequestObj.page,
      "pageSize": 25,
      "sort": "status",
      "order": "asc"
    }
    try {
      const response: any = await this.productManagementService.getSummary(summaryData, token);
      this.hasMoreRecords = response.data.length === 25;
      this.summaryResponse = response.data;
      this.processResponseData(response, this.params);
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
    finally {
      this.spinner.hide();
    }
  }

  async getDropdown(){
    const token = localStorage.getItem('authToken');
    try {
      const response:any = await this.productManagementService.getDropdown(token);
      this.dropdownData = response.data;
      console.log(this.dropdownData)
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
  }



  // getDropdown(){
  //   const token = localStorage.getItem('authToken');
  //   this.productManagementService.getDropdown(token).toPromise().then(response => {
  //     console.log(response);
  //   })
  // }


  /**
     * Function to call api and set ag-grid dataSource object
     *
     * @createdDate 03-10-2024
     * @author PSI-Enhancements
    */
  setDataSourceAgGrid() {
    if (!this.isLoadingSummaryData) {
      this.selectedAllRows = false;
      this.selectedRowCount = 0;
      this.selectedRows = [];
      this.selectedCardRows = [];
      this.mixType = false;
      // angular.element('.checkbox_select_all').prop('checked', false);
      this.isLoadingSummaryData = true;
      // this.gridOptions.api.hideOverlay();
      this.reportRequestObj.page = 1;
      this.productToolSummary = [];
      this.productToolCardSummary = [];
      this.hasMoreRecords = true;
      this.isLoading = false;
      this.busy = true;
      // if (this.isGridSortApplied !== true) {
      //     this.summaryTopBarConfig.actions = this.productToolService.getDefaultActions(this.reportRequestObj,
      //         this.permissions.permissions.Create);
      // }
      this.isGridSortApplied = false;
      const dataSource = {
        rowCount: null,
        getRows: (params) => {
          this.params = params;
          if (!this.isLoading && (this.reportRequestObj.page === 1 ||
            (params.startRow >= this.productToolSummary.length)) && this.hasMoreRecords) {
            this.isLoading = true;
            this.getSummaryData();
          }
          else {
            this.successCallback(params);
          }
          // if (!this.filtersList) {
          // this.setFilterList();
          // }
        }
      };
      this.gridOptions.api.setDatasource(dataSource);
    }
  }


  /**
     * Function to return display rows object
     *
     * @createdDate 03-10-2024
     * @author PSI-Enhancements
     * @param array data
     * @param number startRow
     * @param number endRow
    */
  getDisplayRows (data, startRow, endRow) {
    const rowsThisPage = data.slice(startRow, endRow);
    let lastRow = -1;
    if (!this.hasMoreRecords) {
      lastRow = data.length;
    }
    return { rowsThisPage: rowsThisPage, lastRow: lastRow };
  }


  /**
     * Function to process response data.
     * @createdDate 08-10-2024
     * @author PSI-Enhancements
     * @param object response
     * @param object params
    */
  processResponseData (response, params) {
    if (response.data.length > 0) {
      // response.data.forEach(row => {
      //     row.iconPaymentClass = row.is_active ? '' : 'fas fa-ban u-mt1 u-ml2 neutral-light';
      // });
      this.productToolSummary = [...this.productToolSummary || [], ...response.data];
      this.productToolCardSummary = [...this.productToolCardSummary || [], ...response.data];
      this.reportRequestObj.page++;
      this.successCallback(params);
    }
    else if (this.reportRequestObj.page === 1) {
      params.successCallback(this.productToolSummary, 0);
      this.gridOptions.api.showLoadingOverlay();
      this.productToolCardSummary = [];
    }
    else {
      this.successCallback(params);
    }
    this.isLoading = false;
    this.busy = false;
    this.isLoadingSummaryData = false;
  }

  /**
     * Function to call success callback for ag-grid.
     * @createdDate 08-10-2024
     * @author PSI-Enhancements
     * @param object params
    */
  successCallback(params): void {
    setTimeout(() => {
      const returnObj = this.getDisplayRows(this.productToolSummary, params.startRow, params.endRow);
      params.successCallback(returnObj.rowsThisPage, returnObj.lastRow);
    }, 500);
  }

  addProduct() {
    this.router.navigate(['/product-management/add']);
  }

  applyFilters() {
    console.log("a");
    
  }
  resetFilters () {
    console.log("b");
  }

}
