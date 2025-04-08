import { Component, OnInit, Renderer2 } from '@angular/core';
import { ProductManagementService } from './product-management.service';
import { AuthService } from '../authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { CmpAttachmentModalComponent } from 'src/app/shared/components/cmp-attachment-modal/cmp-attachment-modal.component';
import { MassUploadExcelModalComponent } from '../product-management/mass-upload-excel-modal/mass-upload-excel-modal.component';
import { CmpNotesModalComponent } from 'src/app/shared/components/cmp-notes-modal/cmp-notes-modal.component';
import { ConfirmationModalComponent } from '../organism/confirmation-modal/confirmation-modal.component';
import { interval, Subscription } from 'rxjs';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';

@Component({
	selector: 'app-product-management',
	templateUrl: './product-management.component.html',
	styleUrls: ['./product-management.component.scss']
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
	productToolSummary: any[] = [];
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
	topPanelConfig: any
	filterList: any = {};
	permissions: any = {};
	FileSaver: any;
	downloading: boolean;
	filtermodal: any;
	private timerSubscriptions = new Map<number, Subscription>();





	// summary-top-box-code
	summaryBoxData: any;

	constructor(
		private productManagementService: ProductManagementService,
		private router: Router,
		private commonService: CommonService,
		private commonBackendService: CommonBackendService,
		private route: ActivatedRoute,
		private simpleModalService: SimpleModalService,
		private renderer: Renderer2
	) { }

	ngOnInit(): void {
		this.filterList = this.route.snapshot.data['filterList'];
		this.permissions = this.route.snapshot.data['permissions'];
		this.topPanelConfig = this.productManagementService.getTopPanelConfig(this.permissions);
		this.updateTopPanelConfig();
		this.reportRequestObj = {
			"page": this.reportRequestObj.page,
			"pageSize": 25,
			"sort": "",
			"order": "asc",
			"universal_search": ""
		};
		this.selectedRowCount = 0;
		this.productToolCardSummary = [];
		this.busy = true;
		this.filters = {};
		this.permissionObj = {};
		this.isSorting = false;
		this.scrollDisabled = false;
		this.initGridOptions();
		this.productToolSummary = [];






	// summary-top-box-code
		this.summaryBoxData = this.productManagementService.getSummaryBoxData();
	}


	/**
	 * Function to initialize grid options
	 * @author PSI-Enhancement
	 */
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
				this.reportRequestObj.page = 1;
				this.reportRequestObj.sort = allSortModels[0].colId;
				this.reportRequestObj.order = allSortModels[0].sort;
			} else {
				this.reportRequestObj.sort = '';
				this.reportRequestObj.order = 'asc';
			}
			this.productToolSummary = [];
		};
		this.gridOptions.getRowClass = function (params) {
			if (params.data && params.data.checked && params.data.checked === true) {
				return 'grid-selected-row';
			}
			return '';
		};
		this.gridOptions.onCellClicked = (params) => {
			if (params.colDef.cellRenderer === 'checkbox' && (params.event.srcElement.className === 'checkbox_gir_row')) {
				this.selectCheckBox(params);
			} else if (params.event.target.className === 'fal fa-file show-attachment-modal' || params.event.target.className === 'fas fa-file show-attachment-modal') {
				this.openAttachmentListPopup(params.data.product_id);
			} else if (params.event.target.className === 'fal fa-comment note-modal' || params.event.target.className === 'fas fa-comment note-modal') {
				this.getNotes(params.data.product_id, params);
			} else if (params.colDef.cellRenderer === 'idRender' && (params.event.target.className === 're-sync')) {
				this.productManagementService.syncOrder(params.value).subscribe((response: any) => {
					if (!response.hasError) {
						params.data.ns_status = 2;
						const subscription = interval(30000).subscribe(() => {
							this.getSyncStatusDetails(params);
						});
						this.timerSubscriptions.set(params.data.product_id, subscription);
						this.gridOptions.api.redrawRows();
					}
				});
			}
		};
		this.gridOptions.onCellMouseOver = (params) => {
			if (params && params.event) {
				const agCelltooltip = params.event.target.closest('.tooltip-cell');
				const tooltipCell = agCelltooltip?.querySelector('.add-tooltip');
				if (tooltipCell) {
					const textEllipsisElement = agCelltooltip.querySelector('.text-ellipsis');
					const scrollWidth = textEllipsisElement.scrollWidth;
					const offsetWidth = textEllipsisElement.offsetWidth;
					if (offsetWidth < scrollWidth) {
						this.renderer.addClass(tooltipCell, 'tooltip-text');
					} else {
						this.renderer.removeClass(tooltipCell, 'tooltip-text');
					}
				}
			}
		};
	}

	/**
	 * Function to get notes.
	 * @author PSI-Enhancement
	 * @param number id
	 * @param object param
	 */
	getNotes(Id, param) {
		this.commonService.showSpinner();
		this.commonBackendService.getNotes(this.permissions.kind_id,
			this.permissions.tool_id, Id, this.permissions.menu_item_id).subscribe((result: any) => {
				if (!result.hasError) {
					this.showNotesModal(param.length === 0 ? Id : [Id], result.notes, false, param);
				} else {
					this.commonService.showToastV2Message(true, result.msg, 'fas fa-exclamation-circle');
				}
				this.commonService.hideSpinner();
			}, (error) => {
				this.commonService.hideSpinner();
				this.commonService.showToastV2Message(true, 'Failed to load notes', 'fas fa-exclamation-circle');
			}
			);
	}

	/**
	 * Function to open add notes popup.
	 * @author PSI-Enhancement
	 * @param number id
	 * @param array notes
	 * @param boolean multiple
	 * @param object params
	 */
	showNotesModal(entityIds, notes, multiple, params) {
		var noteDetails = { notes: [] };
		noteDetails.notes = notes;
		let modalData = {
			notesPermission: this.filterList.entity_permissions,
			cancelAction: { label: 'Cancel' },
			saveAction: { label: 'Save' },
			filtersList: this.filterList,
			permissions: this.permissions,
			entityIds: entityIds,
			modalTitle: 'NOTES',
			multiple,
			newToast: true,
			showDismissIcon: true,
			showErrorInNewToast: true,
			newToastMsg: 'Failed',
			latestDesign: true,
			noteDetails,
			showLine: true,
			noDataMessage: 'No Notes Found',
		}
		this.simpleModalService.addModal(CmpNotesModalComponent, { modalData })
			.subscribe((result) => {
				if (result !== undefined) {
					if (!notes || notes.length !== result) {
						this.unSelectAllCheckbox(entityIds, result, 'total_notes');
					}
				}
			});
	}

	/**
	 * Function to open Attachment Popup for the attachment list
	 * 
	 * @param entity 
	 * @author PSI-Enhancement
	 */
	openAttachmentListPopup(entity: any) {
		if (this.permissions.permissions.Update) {
			this.commonService.showSpinner();
			this.productManagementService.getAttachmentList({ tool: this.filterList.tool_id, entity: entity }).subscribe((response: any) => {
				if (!response.hasErrors) {
					this.showAttachment(false, [entity], response);
				} else {
					this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
				}
				this.isLoading = false;
				this.commonService.hideSpinner();
			}, (error: any) => {
				this.isLoading = false;
				this.commonService.hideSpinner();
				this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
			});
		}
	}

	/**
	 * Function to show attachment modal
	 * @param boolean multiple
	 * @param array entityIds
	 * @param object attachments
	 * @author PSI-Enhancement
	 */
	showAttachment(multiple: any, entityIds: any, attachments: any) {
		let modalData: any;

		modalData = {
			modalTitle: 'Attachment',
			showDismissIcon: true,
			noDataMessage: 'No Attachments Found',
			emptyDataIcon: 'far fa-surprise',
			entityIds: entityIds,
			attachmentPermission: this.filterList.entity_permissions,
			cancelAction: { label: 'Cancel' }, saveAction: { label: 'Save' }, filtersList: this.filterList,
			multiple: multiple,
			showFileType: true,
			fileTypeDropdown: this.permissions.entity_kinds,
			showPrivacyIcon: true,
			attachmentDetails: JSON.parse(JSON.stringify(attachments)),
		};
		this.simpleModalService.addModal(CmpAttachmentModalComponent, { modalData })
			.subscribe((result) => {
				if (result !== undefined) {
					if (!attachments.data || attachments.data.length !== result) {
						this.unSelectAllCheckbox(entityIds, result, 'total_attachments');
					}
				}
			});
	}

	/**
	 * Function to unselect all checkboxes
	 * @author PSI-Enhancement
	 * @param entityIds
	 * @param count
	 * @param keyName
	 */
	unSelectAllCheckbox(entityIds: any, count: any, keyName: any) {
		for (var a in this.productToolSummary) {
			if (entityIds.indexOf(this.productToolSummary[a].product_id) !== -1) {
				this.productToolSummary[a][keyName] = count;
			}
			this.productToolSummary[a].checked = false;
		}
		this.selectedRowCount = 0;
		this.selectedRows = [];
		this.updateTopPanelConfig();
		this.gridOptions.api.redrawRows();
	}

	/**
	 * Function to get summary data
	 * @author PSI-Enhancements
	 */
	async getSummaryData() {
		this.isLoadingSummaryData = true;
		this.commonService.showSpinner();
		const token = localStorage.getItem('authToken');
		const summaryData = this.reportRequestObj;
		try {
			const response: any = await this.productManagementService.getSummary(summaryData, token);
			if (!response.hasError) {
				this.hasMoreRecords = response.data.length === 25;
				this.summaryResponse = response.data;
				this.processResponseData(response, this.params);
				this.topPanelConfig.totalResult = response.resultCount
			} else {
				this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
				this.isLoadingSummaryData = false;
			}
		} catch (error) {
			console.error("Error fetching summary:", error);
		} finally {
			this.commonService.hideSpinner();
		}
	}

	/**
	 * Function to call api and set ag-grid dataSource object
	 * @author PSI-Enhancements
	 */
	setDataSourceAgGrid() {
		if (!this.isLoadingSummaryData) {
			this.selectedAllRows = false;
			this.selectedRowCount = 0;
			this.selectedRows = [];
			this.selectedCardRows = [];
			this.mixType = false;
			this.isLoadingSummaryData = true;
			this.gridOptions.api.hideOverlay();
			this.reportRequestObj.page = 1;
			this.productToolSummary = [];
			this.productToolCardSummary = [];
			this.hasMoreRecords = true;
			this.isLoading = false;
			this.busy = true;
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
				}
			};
			this.updateTopPanelConfig();
			this.gridOptions.api.setDatasource(dataSource);
		}
	}


	/**
	 * Function to return display rows object
	 * @author PSI-Enhancements
	 * @param array data
	 * @param number startRow
	 * @param number endRow
	 */
	getDisplayRows(data, startRow, endRow) {
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
	processResponseData(response, params) {
		if (response.data.length > 0) {
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
	 * @author PSI-Enhancements
	 * @param object params
	 */
	successCallback(params): void {
		setTimeout(() => {
			const returnObj = this.getDisplayRows(this.productToolSummary, params.startRow, params.endRow);
			params.successCallback(returnObj.rowsThisPage, returnObj.lastRow);
		}, 500);
	}

	/**
	 * Function to add new product
	 * @author PSI-Enhancement
	 */
	addProduct() {
		this.router.navigate(['/product-management/add']);
	}

	/**
	 * Function to apply filters
	 * @param object selectedFilters
	 * @author PSI-Enhancement
	 */
	applyFilters(selectedFilters: any) {
		this.filtermodal = Object.keys(selectedFilters).reduce((acc, key) => {
			if (key == 'clients') {
				acc['client'] = selectedFilters[key].map((item: any) => item.id);
			} else if (key == 'is_active') {
				acc['active_status'] = [selectedFilters[key] == 0 ? '1' : '0'];
			} else if (key == 'is_rejected') {
				acc[key] = selectedFilters[key];
			} else {
				acc[key] = selectedFilters[key].map((item: any) => item.id);
			}
			return acc;
		}, {});
		this.reportRequestObj = {
			...this.reportRequestObj,
			...this.filtermodal
		};
		this.reportRequestObj.page = 1;
		this.reportRequestObj.universal_search = this.topPanelConfig.searchText.trim();
		this.productToolSummary = [];
		this.updateTopPanelConfig();
		this.setDataSourceAgGrid();
	}

	/**
	 * Function to reset summary grid filters.
	 * @author PSI-Enhancement
	 */
	resetFilters() {
		this.filtermodal = {};
		this.reportRequestObj = {
			"page": 1,
			"pageSize": 25,
			"sort": "",
			"order": "asc",
			"universal_search": ""
		}
		this.topPanelConfig.searchText = '';
		this.productToolSummary = [];
		this.selectedRowCount = 0;
		this.updateTopPanelConfig();
		this.setDataSourceAgGrid();
	}

	/**
	 * Function to universal search
	 * @param string text
	 * @author PSI-Enhancement
	 */
	universalSearch(text) {
		this.reportRequestObj.universal_search = text;
		this.productToolSummary = [];
		this.setDataSourceAgGrid();
	}

	/**
	 * Function to call on select all checkbox change
	 * @param boolean isChecked
	 * @author PSI-Enhancement
	 */
	onSelectAllChanged(isChecked: boolean) {
		this.updateCheckboxState(isChecked);
	}

	/**
	 * Function to update checkbox state
	 * @param boolean checked
	 * @author PSI-Enhancement
	 */
	updateCheckboxState(checked: boolean) {
		if (checked) {
			this.selectedRows = this.productToolSummary.map(order => order.product_id);
		} else {
			this.selectedRows = [];
		}
		let inActive = false;
		this.productToolSummary.forEach(order => {
			order.checked = checked;
			inActive = order.is_active === 0;
		});
		this.selectedAllRows = checked;
		this.selectedRowCount = this.selectedAllRows ? this.productToolSummary.length : 0;
		this.updateTopPanelConfig(inActive);
		this.gridOptions.api.redrawRows();
	}

	/**
	 * Function to select checkbox on row click
	 * @param object params
	 * @author PSI-Enhancement
	 */
	selectCheckBox(params: any) {
		if (this.productToolSummary[params.rowIndex].checked) {
			this.productToolSummary[params.rowIndex].checked = false;
			this.selectedRowCount--;
			let index = this.selectedRows.indexOf(params.data.product_id);
			if (index > -1) {
				this.selectedRows.splice(index, 1);
			}
		} else {
			this.productToolSummary[params.rowIndex].checked = true;
			this.selectedRowCount++;
			this.selectedRows.push(params.data.product_id);
		}

		if (this.selectedRowCount === 0) {
			this.selectedAllRows = false;
		} else {
			this.selectedAllRows = true;
		}
		this.updateTopPanelConfig(params.data.is_active === 0);
		this.gridOptions.api.redrawRows();
	}

	/**
	 * Function to call on click of top bar action items
	 * @author PSI-Enhancement
	 * @param object action
	 */
	onClickAction(action): void {
		switch (action.key) {
			case 'notes':
				if (this.selectedRowCount === 1) {
					this.getNotes(this.selectedRows[0], []);
				} else {
					this.showNotesModal(this.selectedRows, [], true, null);
				}
				break;
			case 'attachment':
				if (this.selectedRows.length === 1) {
					this.openAttachmentListPopup(this.selectedRows[0]);
				} else {
					this.showAttachment(true, this.selectedRows, {});
				}
				break;
			case 'edit':
				this.navigateToEdit();
				break;
			case 'mass_upload':
				this.openMassUploadExcelPopup();
				break;
			case 'active':
				if (this.selectedRows && this.selectedRows.length > 0) {
					this.getActivateAPI(action.isActive);
				}
				break;
			case 'filter_button':
				this.topPanelConfig.expandFilter = !this.topPanelConfig.expandFilter;
				break;
			case 'new_product':
				this.router.navigate(['/product-management/add']);
				break;
			default:
				break;
		}
	}

	/**
	 * Function to call activate/deactivate API
	 * @author PSI-Enhancement
	 * @param boolean isActive
	 */
	getActivateAPI(isActive) {
		this.commonService.showSpinner();
		this.productManagementService.getActivateAPI(this.selectedRows, !isActive).subscribe((response) => {
			this.commonService.hideSpinner();
			if (!response.hasError) {
				this.setDataSourceAgGrid();
				this.commonService.showToastV2Message(true, response.msg, 'fas fa-check-circle', 'success');
			} else {
				this.commonService.showToastV2Message(true, response.msg, 'fas fa-exclamation-circle');
			}
		});
	}

	/**
	 *Function to open upload mass bulk product popup.
	 * @author PSI-Enhancements
	 */
	openMassUploadExcelPopup() {
		const modalData = this.productManagementService.getMassExcelModalData();
		this.simpleModalService.addModal(MassUploadExcelModalComponent, { modalData })
	}

	/**
	 * Navigates to the product edit page based on the current route if a product ID is present.
	 * @returns {void}
	 * @author PSI-Enhancement
	 */
	navigateToEdit() {
		if (this.selectedRows[0]) {
			if (this.selectedRows.length === 1) {
				this.router.navigate([`product-management/${this.selectedRows[0]}/edit`]);
			} else {
				const modalData = {
					title: 'You can only edit 1 product at a time.',
					btnLabel: [
						{ type: 'Btn', label: 'Ok', class: 'primary' }
					]
				}
				this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
			}
		}
	}

	/**
	 * Function to Update top panel config
	 * @author PSI-Enhancement
	 * @param boolean isActive
	 */
	updateTopPanelConfig(isActive?: boolean) {
		this.topPanelConfig.actions = this.productManagementService.getActionsIconsConfig(
			this.selectedRowCount,
			this.permissions,
			this.reportRequestObj,
			isActive
		);

	};

	/**
	 * Fetches the synchronization status details for a specific product.
	 * @param {Object} params - The grid row parameters containing product data.
	 * @returns {void}
	 * @author PSI-Enhancement
	 */
	getSyncStatusDetails(params) {
		this.productManagementService.getSyncStatusDetails(params.data.product_id).subscribe((response: any) => {
			if (!response.hasError && response.data) {
				params.data.ns_status = response.data.status;
				if (response.data.status === 1) {
					this.commonService.showToastV2Message(true, 'Sync Successful', null, 'success');
				} else if (response.data.status === 3) {
					this.commonService.showToastV2Message(true, 'Sync Failed');
				}
				this.gridOptions.api.redrawRows();
				this.clearTimer(params.data.product_id);
			} else {
				this.clearTimer(params.data.product_id);
				params.data.ns_status = 3;
				this.gridOptions.api.redrawRows();
				this.commonService.showToastV2Message(true, 'Save Failed');
			}
		});
	}

	/**
	 * Function to unsubscribe the subscription
	 * @param productID 
	 * @author PSI-Enhancement
	 */
	clearTimer(productID) {
		if (this.timerSubscriptions.has(productID)) {
			this.timerSubscriptions.get(productID).unsubscribe();
			this.timerSubscriptions.delete(productID);
		}
	}
}
