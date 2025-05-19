import { Component, Input, OnInit } from '@angular/core';
import { FormulaService } from '../formula.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/core/services/common.service';
import { formulaDetailService } from './formula-details.service';
import AppConstant from 'src/app/app.constant';
import { CommonBackendService } from 'src/app/core/services/common-backend-service.service';
import * as moment from 'moment';
import { AuthService } from '../../authentication/auth.service';
import { FsArchiveModalComponent } from '../fs-archive-modal/fs-archive-modal.component';
import { SimpleModalService } from 'ngx-simple-modal';

@Component({
    selector: 'app-formula-details',
    templateUrl: './formula-details.component.html',
    styleUrls: ['./formula-details.component.scss'],
})
export class FormulaDetailsComponent implements OnInit {
    statusClass: any;
    headerTitle: any;
    status: any;
    statusIcon: any;
    IconHeaderStatus: any;
    documentTitle: string;
    documentDetails: any;
    tabGroupConfig: { key: string; label: string; }[];
    activeTab: string;
    formulaDetails: any;
    detailFormula: any;
    actionButtons: any = [];
    syncStatusFail: boolean;
    timerObj: any;
    permissions: any;
    backToFormulaTitle: string = 'Back to Formulas';
    isAuditDataIsLoading: boolean = false;
    auditList: any = [];
    rowAuditTrailConfigApiRequest: any = [];
    filterList: any;
    archiveData: any;
    archiveWarningMessage: string = '';
    archiveFailedMessage: string = '';
    configUpload: any;

    constructor(
        private FormulaService: FormulaService,
        private formulaDetailService: formulaDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private spinner :NgxSpinnerService,
        private commonService : CommonService,
        private commonBackendService: CommonBackendService,
        private authService: AuthService,
        private modalService: SimpleModalService
    ) { }

    ngOnInit(): void {
        const token = this.authService.getToken();
        this.FormulaService.getDropdown(token).then(result => {
            this.filterList = result;
          }).catch(error => {
            console.error('Failed to fetch dropdown:', error);
          });
        this.permissions = this.route.snapshot.data['permissions'];
        this.IconHeaderStatus = 'Inactive';
        this.documentTitle = 'DOCUMENTS';
        const formulaId = this.route.snapshot.paramMap.get('id');
        this.tabGroupConfig = this.getTabGroupConfig();
        this.activeTab = this.tabGroupConfig[2].key;
        this.getFormulaData(formulaId);
        this.headerTitle = "UNIQUE ID";
        this.configUpload = {
            allowedExtensions: ['gif', 'jpeg', 'jpg', 'png', 'tiff', 'tif', 'zip', 'pdf','xls', 'doc', 'docx', 'xlsx','pages', 'xlsm', 'csv', 'odt'],
            isShowUploader: true
        };
    }

    /**
     * Function to get product data
     * 
     * @param formulaId 
     * @returns void
     * @author PSI-VIII
     */
    async getFormulaData(formulaId : string) {
        try {
            this.spinner.show();
            await this.FormulaService.getDetails(formulaId).then((res: any) => {
                this.spinner.hide();
                if (!res.hasError) {
                    this.updateFormulaData(res.data);
                } else {
                    this.commonService.showToastV2Message(true, res.msg, 'fas fa-exclamation-circle');
                    this.router.navigate(['../']);
                }
            });
          }
          catch (error) {
            console.error("Error fetching ProductData:", error);
          }
    }

    updateFormulaData(response) {
        this.formulaDetails = response;
        this.detailFormula = this.fieldsDetail(response);
        this.documentDetails = this.documentDetail(response);
        this.getStatusUpdate();
        this.actionButtons = this.getactionButtons(this.permissions ,this.formulaDetails);
        this.headerTitle = "UNIQUE ID : " + this.formulaDetails.id;
        this.getAuditTrailData();
        this.rowAuditTrailConfigApiRequest = this.formulaDetailService.getDetailsAuditTrailConfigApiRequest();
    }

    /**
     * Handles the click event for performing an action.
     *
     * @param string
     * @returns {boolean | void}
     * @author PSI-VIII
     */
    onClickAction(action) {
         if (action.key === 'edit') {
            this.navigateToEdit();
        }  else if (action.key === 'Archive') {
            this.updateArchives();
        }
        else{
            return true;
        }
    }

    /**
     * Navigates to the formula edit page based on the current route if a formula ID is present.
     *
     * @returns {void}
     * @author PSI-VIII
     */
    navigateToEdit() {
        if (this.formulaDetails.id) {
            const currentPath = this.route.snapshot.pathFromRoot
              .map(route => route.url.map(segment => segment.toString()).join('/'))
              .join('/');
            const editPath = `${currentPath}/edit`;

            this.router.navigate([editPath]);
        }
    }

    /**
     * Navigates to the formulas page when the back button is clicked.
     *
     * @returns {void}
     * @author PSI-VIII
     */
    onClickback() {
        this.router.navigate(['/formula']);
    }

    /**
     * Updates the status and assigns the corresponding CSS class based on the formula's status.
     *
     * @returns {void}
     * @author PSI-VIII
     */
    getStatusUpdate() {
        this.status = this.formulaDetails.formula_status;
        if (this.status === '--') {
            this.statusClass = 'badge med u-bg-white';
        } else if (this.status === 'Approved') {
            this.statusClass = 'badge med u-bg-success-lite';
        } else if (this.status === 'Rejected') {
            this.statusClass = 'badge med u-bg-reject';
        } else if (this.status === 'Filed') {
            this.statusClass = 'badge med u-bg-filed';
        } else if (
            this.status === 'Needs Action - Waiting on Supplier' ||
            this.status === 'Needs Action-Waiting on Supplier') {
            this.statusClass = 'badge med u-bg-warning';
        } else if (this.status === 'Pending Samples - Waiting on Supplier') {
            this.statusClass = 'badge med u-bg-pending';
        } else if (
            this.status === 'Request Received' ||
            this.status === 'Cancelled'
        ) {
            this.statusClass = 'badge med u-bg-neutral-light';
        } else if (this.status === 'Under Review') {
            this.statusClass = 'badge med u-bg-error-medium';
        } else {
            this.statusClass = 'badge med u-bg-neutral-light';
        }
        
    }

    /**
     * Returns the configuration for the tab group, including keys and labels.
     *
     * @returns {Array} An array of tab configuration objects, each containing a key and label for the tab.
     * @author PSI-VIII
     */
    getTabGroupConfig() {
        return this.formulaDetailService.getTabGroupConfig();
    }

    /**
     * Sets the active tab based on the selected tab.
     *
     * @param {Object} tab - The selected tab object.
     * @returns {void}
     * @author PSI-VIII
     */
    clickTabGroup(tab) {
        this.activeTab = tab.key
    }

  

    /**
     * The function `documentDetail` processes formula details to generate an array of document links
     * with labels and values.
     * @param formulaDetails - The `documentDetail` function takes in a `formulaDetails` object as a
     * parameter. It then processes the `formulaDetails` object to extract information related to
     * various document types such as List of Ingredients Document, FIDS Document, Method of
     * Manufacturing Document, and Formula Approval Document. It also includes details
     * @returns An array of objects containing details about documents related to a formula, such as
     * document labels, display names, file URLs, dates approved, and expiration dates.
     * @author PSI-VIII
     */
    documentDetail(formulaDetails) {
        let response = [];

        if (formulaDetails) {
            const makeLink = (label, value, url) => ({
                label,
                value: this.formulaDetailService.valueChecker(value),
                url: url ? url.replace(/\\\//g, "/") : ''
            });

            const getUploadsByKind = (kindName) => {
                const uploads = formulaDetails.entity_uploads?.filter(upload => upload.kind_name === kindName);
                return uploads && uploads.length > 0 ? uploads : [{ display_name: '--', file_url: '' }];
            };

            const documentTypes = [
                { label: 'List of Ingredients Document', kind: 'List of Ingredients' },
                { label: 'Method of Manufacturing Document', kind: 'Method of Manufacturing' },
                { label: 'FIDS Document', kind: 'FIDS' },
                { label: 'Formula Approval Document', kind: 'Formula Approval Document' }

            ];

            documentTypes.forEach(doc => {
                const uploads = getUploadsByKind(doc.kind);
                uploads.forEach((upload, index) => {
                    const docLabel = uploads.length > 1 ? `${doc.label} (${index + 1})` : doc.label;
                    response.push(makeLink(docLabel, upload.display_name, upload.file_url));
                });
            });
        }
        return response;
    }

  /**
     * Get product fields to get a response array with corresponding labels and values.
     *
     * @param {Object} row - The row of product data.
     * @returns {Array} The response array with labels and formatted values for the fields.
     * @author PSI-VIII
     */
    fieldsDetail(row) {
        const details = this.formulaDetailService.getFieldsDetail(row);
    details.push(
            { label: 'Date Approved', value: this.formulaDetailService.valueChecker(row.date_approved), tooltip: '', iconClass: '' },
            { label: 'Date Expired', value: this.formulaDetailService.valueChecker(row.date_expired), tooltip: '', iconClass: '' }
        );
    
    return details;
    }
    /**
     * Function to get action buttons.
     *
     * @param {object} permissions 
     * @param {object} detail 
     * @returns {object} button-config
     * @author PSI-VIII
     */
    getactionButtons(permissions, detail) {
        return this.formulaDetailService.getActionButtons(permissions, detail);
    }


    /**
     * Fetches and processes the audit trail data from the backend, formatting the date and current data
     * 
     * @returns {void} 
     * 
     * @author PSI-VIII
     */
    getAuditTrailData() {
        let req_obj = {
            entity: this.formulaDetails.id,
            menu_item_id: this.permissions.menu_item_id,
            tool: this.permissions.tool_id
        }
        this.isAuditDataIsLoading = true;
    
        this.commonBackendService.getAuditTrailData(req_obj).subscribe(
            (response: any) => {
                if (!response.hasError) {
                    const filteredData = response.data
                        .filter(row => row.type !== 'attachment created' && row.type !== 'attachment deleted')
                        .map(row => {
                            row.date = moment(row.date).format('MM/DD/YY hh:mm');
                            this.getAuditTrailFormattedData(row);
                            return row;
                        });
    
                    this.auditList = filteredData;

                    if (this.auditList && this.auditList[0]) {
                        this.filterAuditData();
                    }
                } else {
                    this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
                }
            },
            (error) => {
                this.commonService.showToastV2Message(true, 'Failed', 'fas fa-exclamation-circle');
            },
            () => {
                this.isAuditDataIsLoading = false;
            }
        );
    }    

    /**
     * Formats the audit trail data for the given row, processing the `current_data` and `previous_data` 
     * 
     * @param row - The audit trail row to process, containing `current_data` and optionally `previous_data`.
     * 
     * @author PSI-VIII
     */
    getAuditTrailFormattedData(row) {
        let addressKeys = ['license_address'];
        row.current_data = this.processData(row.current_data, addressKeys);
        if(row.previous_data) {
            row.previous_data = this.processData(row.previous_data);
        }
    }

    /**
     * Processes the provided data by formatting boolean and date fields, and rendering the address 
     * 
     * @param data
     * @param addressKeys
     * @returns The processed data object with formatted boolean fields, date fields, and address (if applicable).
     * 
     * @author PSI-VIII
     */
    processData(data, addressKeys = null) {
        if(!data) return;

        const booleanFields = ['is_sample', 'shipment_crosses_border', 'invoice_with_shipment', 'wc_set'];
        booleanFields.forEach( field => {
            if(data[field] != null) {
                data[field] = this.commonService.formateBooleanField(data[field])
            }
        });

        const dateFields = ['estimated_delivery_date', 'delivery_date'];
        dateFields.forEach( field => {
            if (data[field] != null) {
                data[field] = this.commonService.dateFormat(data[field], 'MM/DD/yy');
            }
        });

        if (addressKeys && data.billing_state) {
            this.commonService.renderFormatAddress(addressKeys, data);
        }

        return data;
    }

    /**
     * Filters the audit list by removing invalid data from `current_data` and `previous_data`, 
     * 
     * @author PSI-VIII
     */
    filterAuditData() {
        const objCurrent = this.auditList.filter(obj => {

            if(obj.current_data) {
                obj.current_data = this.removeInvalidData(obj.current_data);
            }

            if(obj.previous_data) {
                obj.previous_data = this.removeInvalidData(obj.previous_data);
            }

            if(this.commonService.isEmptyObj(obj.current_data) && this.commonService.isEmptyObj(obj.previous_data)) {
                return false;
            }

            return true;
        });
        this.auditList = objCurrent;
    }

    /**
     * Removes specific invalid or temporary keys from the given data object.
     * 
     * @param data
     * @returns 
     * 
     * @author PSI-VIII
     */
    removeInvalidData(data) {
        const keysToRemove = [
            'shipment_status', 
            'customer_codes', 
            'customer_prod_codes', 
            'temp_unique_order_id', 
            'temp_customer_code_id'
        ];
    
        return Object.keys(data).reduce((cleanedData, key) => {
            if (!keysToRemove.includes(key) && data[key] != null) {
                cleanedData[key] = data[key];
            }
            return cleanedData;
        }, {});
    }

    /**
     * The function `updateArchives` handles archiving and unarchiving of data based on user input
     * through a modal dialog.
     * @returns 
     * @author PSI-VIII
     */
    updateArchives(): void {
        const archiveData: any = {
          ids: [this.formulaDetails.id],
          archive_status: parseInt(this.formulaDetails.is_archived, 10),
        };

        let modalTitle = '';
        let archiveWarningMessage = '';
        let archiveFailedMessage = 'Failed';
      
        if (archiveData.archive_status === 1) {
          archiveData.archive = 'N';
          archiveWarningMessage = 'Unarchived Successfully';
          modalTitle = 'Are you sure you want to unarchive it?';
        } else {
          archiveData.archive = 'Y';
          archiveWarningMessage = 'Archived Successfully';
          modalTitle = 'Are you sure you want to archive it?';
        }
      
        const modalData = {
          title: modalTitle,
          iconClass: 'fas fa-exclamation-circle fa-4x u-red',
          btnLabel: [
            { type: 'Btn', label: 'No', class: 'secondary' },
            { type: 'Btn', label: 'Yes', class: 'primary' }
          ],
          archiveData,
          archiveWarningMessage,
          archiveFailedMessage,
          detail: true
        };
      
        this.modalService.addModal(FsArchiveModalComponent, { modalData })
          .subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.getFormulaData(this.formulaDetails.id);
            }
          });
      } 
}
