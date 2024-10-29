import { Component, OnInit } from '@angular/core';
import { ProductManagementService } from './product-management.service';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { RouterModule } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';

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
  filterList: any = {};
  FileSaver: any;
  downloading: boolean;
  selectAllFlag: boolean;
  filtermodal: any;

  constructor(
    private productManagementService: ProductManagementService,
    private authService: AuthService,
    private router: Router,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {   
    this.getDropdown();
    this.topPanelConfig = this.productManagementService.getTopPanelConfig();
    this.reportRequestObj = {
      "page": this.reportRequestObj.page,
      "pageSize": 25,
      "sort": "status",
      "order": "asc",
      "universal_search": ""
    };
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
    //     // page: 1,
    //     pageSize: 25,
    //     sort: 'status',
    //     order: 'desc',
    // };
    // this.summaryTopBarConfig = this.productToolService.getSummaryTopBarConfig();
    // this.summaryTopBarConfig.actions = this.productToolService.getDefaultActions(this.reportRequestObj,
    //     this.permissions.permissions.Create);
    // this.statusObj = this.productToolService.getStatusObject();
    this.initGridOptions();
  }


  initGridOptions() {
    this.gridOptions = this.productManagementService.getGridOption();
	this.gridOptions.onSortChanged = (params) => {
		const allSortModels = params.columnApi.getAllColumns()
            .filter(col => col.getSort())
            .map(col => ({
                colId: col.getColId(),
                sort: col.getSort()
            }));
        
		if (allSortModels && allSortModels.length > 0) {
		  this.reportRequestObj.sort = allSortModels[0].colId;
		  this.reportRequestObj.order = allSortModels[0].sort;
		} else {
		  this.reportRequestObj.sort = 'status';
		  this.reportRequestObj.order = 'asc';
		}
        this.productToolSummary = [];
		this.setDataSourceAgGrid();
	};
    this.gridOptions.onGridReady = () => {
      this.setDataSourceAgGrid();
    };
    this.gridOptions.onCellClicked = (params) => {
      if (params.colDef.cellRenderer === 'checkbox' && (params.event.srcElement.className === 'checkbox_gir_row')) {
          this.selectCheckBox(params);
      }
  }
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
    const summaryData = this.reportRequestObj
    try {
      const response: any = await this.productManagementService.getSummary(summaryData, token);
      this.hasMoreRecords = response.data.length === 25;
      this.summaryResponse = response.data;
      this.processResponseData(response, this.params);
	  this.topPanelConfig.totalResult = response.resultCount
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
    }
    catch (error) {
      console.error("Error fetching summary:", error);
    }
    this.filterList = this.dropdownData;
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
      this.gridOptions.api.hideOverlay();
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

  applyFilters(selectedFilters: any) {
	console.log(selectedFilters);
	this.filtermodal = Object.keys(selectedFilters).reduce((acc, key) => {
        acc[key] = selectedFilters[key].map((item: any) => item.id); 
        return acc;
    }, {});
    this.reportRequestObj = {
      ...this.reportRequestObj,
      ...this.filtermodal
    };
    this.reportRequestObj.page = 1;
    this.productToolSummary = [];
    this.setDataSourceAgGrid();
  }

  resetFilters() {
	this.filtermodal = [];
    this.reportRequestObj = {
      "page": 1,
      "pageSize": 25,
      "sort": "status",
      "order": "asc",
      "universal_search": ""
    }
    this.productToolSummary = [];
    this.setDataSourceAgGrid();
  }

  universalSearch (text) {
    this.reportRequestObj.universal_search = text;
    this.setDataSourceAgGrid();
  }
	excelExport() {
		const body = this.reportRequestObj;
		this.downloading = true;

		this.productManagementService.excelExport(body).subscribe((response) => {
			const data = response.body;
			if (data) {
				const csvBlob = new Blob([data], { type: 'application/force-download' });
				const fileName = this.getFileNameFromHeader(
					response.headers.get('content-disposition')
				);
				saveAs(csvBlob, fileName || 'report.csv');
			}
			this.downloading = false;
		});
	}

	getFileNameFromHeader(header: string | null): string | null {
		if (!header) return null;
		const result = header.split(';')[1].trim().split('=')[1];
		return result.replace(/"/g, '');
	}

  onSelectAllChanged(isChecked: boolean) {
    this.updateCheckboxState(isChecked);
  }

  updateCheckboxState(checked: boolean) {
    for (const order of this.productToolSummary) {
      order.checked = checked;
    }
    this.selectedRowCount = this.selectedAllRows ? this.productToolSummary.length : 0;
    this.gridOptions.api.redrawRows();
    console.log(this.summaryResponse);
  }

  selectCheckBox(params: any) {
    if(this.productToolSummary[params.rowIndex].checked) {
        this.productToolSummary[params.rowIndex].checked = false;
        this.selectedRowCount--;
    } else {
        this.productToolSummary[params.rowIndex].checked = true;
        this.selectedRowCount++;
    }

    if(this.selectedRowCount === 0) {
        this.selectAllFlag = false;
    } else {
        this.selectAllFlag = true;
    }
    this.gridOptions.api.redrawRows();
  }
}
