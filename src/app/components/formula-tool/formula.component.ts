import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormulaService } from './formula.service';
import { AuthService } from '../authentication/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { SimpleModalService } from 'ngx-simple-modal';
import { CmpAttachmentModalComponent } from 'src/app/shared/components/cmp-attachment-modal/cmp-attachment-modal.component';
import { CmpNotesModalComponent } from 'src/app/shared/components/cmp-notes-modal/cmp-notes-modal.component';
import { ConfirmationModalComponent } from '../organism/confirmation-modal/confirmation-modal.component';
import { interval, Subscription } from 'rxjs';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import { FsArchiveModalComponent } from './fs-archive-modal/fs-archive-modal.component';
@Component({
  selector: 'app-formula-tool',
  templateUrl: './formula.html',
  styleUrls: ['./formula.scss']
})

export class FormulaComponent implements OnInit {
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
  formulaToolSummary: any[] = [];
  formulaCardSummary: any;
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
  archiveData: any;
  archiveWarningMessage: string = '';
  archiveFailedMessage: string = '';
  archiveStatus: any;

  constructor(
    private FormulaService: FormulaService,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private commonBackendService: CommonBackendService,
    private route: ActivatedRoute,
    private simpleModalService: SimpleModalService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    const token = this.authService.getToken();
    this.FormulaService.getDropdown(token).then(result => {
      this.filterList = result;
    }).catch(error => {
      console.error('Failed to fetch dropdown:', error);
    });
    this.permissions = this.route.snapshot.data['permissions'];
    this.topPanelConfig = this.FormulaService.getTopPanelConfig(this.permissions);
    this.updateTopPanelConfig();
    this.reportRequestObj = {
      "page": this.reportRequestObj.page,
      "pageSize": 25,
      "sort": "unique_id",
      "order": "dsc",
      "universal_search": "",
      "submission_id": [],
      "formula_status": [],
      "formula_id": [],
      "date_requested_from": "",
      "date_requested_to": "",
      "client_id": ""
    };
    this.selectedRowCount = 0;
    this.formulaCardSummary = [];
    this.busy = true;
    this.filters = {};
    this.permissionObj = {};
    this.isSorting = false;
    this.scrollDisabled = false;
    this.initGridOptions();
    this.formulaToolSummary = [];
  }


  initGridOptions() {
    this.gridOptions = this.FormulaService.getGridOption();
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
      this.formulaToolSummary = [];
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
        this.openAttachmentListPopup(params.data.unique_id);
      } else if (params.event.target.className === 'fal fa-comment note-modal' || params.event.target.className === 'fas fa-comment note-modal') {
        this.getNotes(params.data.unique_id, params);
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
   *
   * @author PSI-VIII
   * @param number id
   * @param object param
   */
  getNotes(Id, param) {
    this.spinner.show();
    this.commonBackendService.getNotes(this.filterList.note_kind_id,
      this.filterList.tool_id, Id, this.filterList.menu_item_id).subscribe((result: any) => {
        if (!result.hasError) {
          this.showNotesModal(param.length === 0 ? Id : [Id], result.notes, false, param);
        } else {
          this.commonService.showToastV2Message(true, result.msg, 'fas fa-exclamation-circle');
        }
        this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        this.commonService.showToastV2Message(true, 'Failed to load notes', 'fas fa-exclamation-circle');
      }
      );
  }

   /**
    * Function to open add notes popup.
    *
    * @author PSI-VIII
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
            this.unSelectAllCheckbox(entityIds, result, 'note_count');
          }
        }
      });
  }

  /**
   * Function to open Attachment Popup for the attachment list
   * 
   * @author PSI-VIII
   * @param entity 
   */
  openAttachmentListPopup(entity: any) {
    if (this.permissions.permissions.Update) {
      this.spinner.show();
      this.FormulaService.getAttachmentList({ tool: this.filterList.tool_id, entity: entity }).subscribe((response: any) => {
        if (!response.hasErrors) {
          this.showAttachment(false, [entity], response);
        } else {
          this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
        }
        this.isLoading = false;
        this.spinner.hide();
      }, (error: any) => {
        this.isLoading = false;
        this.spinner.hide();
        this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
      });
    }
  }

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
      fileTypeDropdown: this.filterList.entity_kinds,
      showPrivacyIcon: true,
      attachmentDetails: JSON.parse(JSON.stringify(attachments)),
    };
    this.simpleModalService.addModal(CmpAttachmentModalComponent, { modalData })
      .subscribe((result) => {
        if (result !== undefined) {
          if (!attachments.data || attachments.data.length !== result) {
            this.unSelectAllCheckbox(entityIds, result, 'attachment_count');
          }
        }
      });
  }

  unSelectAllCheckbox(entityIds: any, count: any, keyName: any) {
    for (var a in this.formulaToolSummary) {
      if (entityIds.indexOf(this.formulaToolSummary[a].unique_id) !== -1) {
        this.formulaToolSummary[a][keyName] = count;
      }
      this.formulaToolSummary[a].checked = false;
    }
    this.selectedRowCount = 0;
    this.selectedRows = [];
    this.updateTopPanelConfig();
    this.gridOptions.api.redrawRows();
  }

  /** 
  * Function to get summary data
  *
  * @author PSI-VIII
  */
  async getSummaryData() {
    this.isLoadingSummaryData = true;
    this.spinner.show();
    const token = localStorage.getItem('authToken');
    const summaryData = this.reportRequestObj;
    try {
      const response: any = await this.FormulaService.getSummary(summaryData, token);
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
      this.spinner.hide();
    }
  }

  /**
     * Function to call api and set ag-grid dataSource object
     *
     * @author PSI-VIII
    */
  setDataSourceAgGrid() {
    if (!this.isLoadingSummaryData) {
      this.changeArchiveUnarchiveTooltipText();
      this.selectedAllRows = false;
      this.selectedRowCount = 0;
      this.selectedRows = [];
      this.selectedCardRows = [];
      this.mixType = false;
      this.isLoadingSummaryData = true;
      this.gridOptions.api.hideOverlay();
      this.reportRequestObj.page = 1;
      this.formulaToolSummary = [];
      this.formulaCardSummary = [];
      this.hasMoreRecords = true;
      this.isLoading = false;
      this.busy = true;
      this.isGridSortApplied = false;
      const dataSource = {
        rowCount: null,
        getRows: (params) => {
          this.params = params;
          if (!this.isLoading && (this.reportRequestObj.page === 1 ||
            (params.startRow >= this.formulaToolSummary.length)) && this.hasMoreRecords) {
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
     *
     * @author PSI-VIII
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
     * @author PSI-VIII
     * @param object response
     * @param object params
    */
  processResponseData(response, params) {
    if (response.data.length > 0) {
      this.formulaToolSummary = [...this.formulaToolSummary || [], ...response.data];
      this.formulaCardSummary = [...this.formulaCardSummary || [], ...response.data];
      this.reportRequestObj.page++;
      this.successCallback(params);
    }
    else if (this.reportRequestObj.page === 1) {
      params.successCallback(this.formulaToolSummary, 0);
      this.gridOptions.api.showLoadingOverlay();
      this.formulaCardSummary = [];
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
     * @author PSI-VIII
     * @param object params
    */
  successCallback(params): void {
    setTimeout(() => {
      const returnObj = this.getDisplayRows(this.formulaToolSummary, params.startRow, params.endRow);
      params.successCallback(returnObj.rowsThisPage, returnObj.lastRow);
    }, 500);
  }

  addFormula() {
    this.router.navigate(['/formula/add']);
  }

  applyFilters(selectedFilters: any) {
    this.filtermodal = Object.keys(selectedFilters).reduce((acc, key) => {
      if (key == 'clients') {
        acc['client'] = selectedFilters[key].map((item: any) => item.id);
      } else if (key == 'is_active') {
        acc['active_status'] = [selectedFilters[key] == 0 ? '1' : '0'];
      } else if (key == 'is_archived') {
        acc['is_archived'] = selectedFilters[key] ? [1] : [];
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
    this.formulaToolSummary = [];
    this.updateTopPanelConfig();
    this.setDataSourceAgGrid();
    this.changeArchiveUnarchiveTooltipText();
  }

  /**
   * Function to reset summary grid filters.
   */
  resetFilters() {
    this.filtermodal = {};
    this.reportRequestObj = {
      "page": 1,
      "pageSize": 25,
      "sort": "unique_id",
      "order": "asc",
      "universal_search": ""
    }
    this.topPanelConfig.searchText = '';
    this.formulaToolSummary = [];
    this.selectedRowCount = 0;
    this.updateTopPanelConfig();
    this.setDataSourceAgGrid();
    this.changeArchiveUnarchiveTooltipText();
  }

  universalSearch(text) {
    this.reportRequestObj.universal_search = text;
    this.formulaToolSummary = [];
    this.setDataSourceAgGrid();
  }

  onSelectAllChanged(isChecked: boolean) {
    this.updateCheckboxState(isChecked);
    this.changeArchiveUnarchiveTooltipText();
  }

  updateCheckboxState(checked: boolean) {
    if (checked) {
      this.selectedRows = this.formulaToolSummary.map(order => order.unique_id);
    } else {
      this.selectedRows = [];
    }
    let inActive = false;
    this.formulaToolSummary.forEach(order => {
      order.checked = checked;
      inActive = order.is_active === 0;
    });
    this.selectedAllRows = checked;
    this.selectedRowCount = this.selectedAllRows ? this.formulaToolSummary.length : 0;
    this.updateTopPanelConfig(inActive);
    this.gridOptions.api.redrawRows();
  }

  selectCheckBox(params: any) {
    if (this.formulaToolSummary[params.rowIndex].checked) {
      this.formulaToolSummary[params.rowIndex].checked = false;
      this.selectedRowCount--;
      let index = this.selectedRows.indexOf(params.data.unique_id);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
    } else {
      this.formulaToolSummary[params.rowIndex].checked = true;
      this.selectedRowCount++;
      this.selectedRows.push(params.data.unique_id);
    }

    if (this.selectedRowCount === 0) {
      this.selectedAllRows = false;
    } else {
      this.selectedAllRows = true;
    }
    this.updateTopPanelConfig(params.data.is_active === 0);
    this.gridOptions.api.redrawRows();
    this.changeArchiveUnarchiveTooltipText();
  }

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
      case 'archive':
        if(this.selectedRows && this.selectedRows.length > 0) {
          this.updateMultipleArchives();
        }
        break;
      case 'edit':
        this.navigateToEdit();
        break;
      case 'filter_button':
        this.topPanelConfig.expandFilter = !this.topPanelConfig.expandFilter;
        break;
      case 'new_formula':
        this.router.navigate(['/formula/add']);
        break;
      default:
        break;
    }
  }

  /**
   * Navigates to the formula edit page based on the current route if a formula ID is present.
   *
   * @returns {void}
   * @author PSI-VIII
   */
  navigateToEdit() {
    if (this.selectedRows[0]) {
      if (this.selectedRows.length === 1) {
        this.router.navigate([`formula/${this.selectedRows[0]}/edit`]);
      } else {
        const modalData = {
          title: 'You can only edit 1 formula at a time.',
          btnLabel: [
            { type: 'Btn', label: 'Ok', class: 'primary' }
          ]
        }
        this.simpleModalService.addModal(ConfirmationModalComponent, { modalData })
      }
    }
  }

  updateTopPanelConfig(isActive?: boolean) {
    this.topPanelConfig.actions = this.FormulaService.getActionsIconsConfig(
      this.selectedRowCount,
      this.permissions,
      this.reportRequestObj,
      isActive
    );

  };

  clearTimer(formulaID) {
    if (this.timerSubscriptions.has(formulaID)) {
      this.timerSubscriptions.get(formulaID).unsubscribe();
      this.timerSubscriptions.delete(formulaID);
    }
  }


  /**
   * The function `changeArchiveUnarchiveTooltipText` updates the tooltip text for an action based on
   * the value of `is_archived` in a report request object.
   * @author PSI-VIII
   */
  changeArchiveUnarchiveTooltipText() {
    const isArchived = Array.isArray(this.reportRequestObj.is_archived)
      ? this.reportRequestObj.is_archived[0]
      : this.reportRequestObj.is_archived;
    this.topPanelConfig.actions[2].tooltipText =
      isArchived == 1 ? 'Unarchive' : 'Archive';
  }
  

  /**
   * The function `updateMultipleArchives` updates the archive status of selected rows based on user
   * confirmation.
   * @returns {void}
   * @author PSI-VIII
   */
  updateMultipleArchives() {
    this.archiveData = {
      ids: this.selectedRows,
      archive: 0
    };
  
    const isArchivedVal = Array.isArray(this.reportRequestObj?.is_archived)
      ? this.reportRequestObj.is_archived[0]
      : this.reportRequestObj?.is_archived;
  
      this.archiveStatus = isArchivedVal == '1' || isArchivedVal == 1 ? 1 : 0;
  
    let modalTitle = '';
    this.archiveFailedMessage = 'Failed';
  
    if (this.archiveStatus === 1) {
      this.archiveData.archive = 'N';
      this.archiveWarningMessage = 'Unarchived Successfully';
      modalTitle = 'Are you sure you want to unarchive it?';
    } else {
      this.archiveData.archive = 'Y';
      this.archiveWarningMessage = 'Archived Successfully';
      modalTitle = 'Are you sure you want to archive it?';
    }
  
    const modalData = {
      title: modalTitle,
      iconClass: 'fas fa-exclamation-circle fa-4x u-red',
      btnLabel: [
        { type: 'Btn', label: 'No', class: 'secondary' },
        { type: 'Btn', label: 'Yes', class: 'primary' }
      ],
      archiveData: this.archiveData,
      archiveWarningMessage: this.archiveWarningMessage,
      archiveFailedMessage: this.archiveFailedMessage
    };
  
    this.simpleModalService.addModal(FsArchiveModalComponent, { modalData })
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.setDataSourceAgGrid();
        }
      });
  }
  
  
}
