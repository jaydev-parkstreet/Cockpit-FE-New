import { Component } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { formulaService } from '../summary.service';
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';

export interface ArchiveModalModel {
  modalData: any;
}

@Component({
  selector: 'app-fs-archive-modal',
  templateUrl: './fs-archive-modal.component.html',
  styleUrls: ['./fs-archive-modal.component.scss']
})
export class FsArchiveModalComponent
  extends SimpleModalComponent<ArchiveModalModel, any>
  implements ArchiveModalModel {

  modalData: any;

  constructor(
    private router: Router,
    private formulaService: formulaService,
    private commonService: CommonService
  ) {
    super();
  }

  onClickBtn(btn): void {
    if (btn.label === 'Yes') {
      this.formulaService.updateMultipleArchives(this.modalData.archiveData).subscribe(
        (response: any) => {
          if (response.status === 500 || response.status === -1 || response.hasError) {
            this.commonService.showToastV2Message(false, this.modalData.archiveFailedMessage, 'fas fa-exclamation-circle', 'error');
          } else {
            this.commonService.showToastV2Message(true, this.modalData.archiveWarningMessage, 'fas fa-exclamation-circle', 'error');
            if (this.modalData.archiveData.archive === 'N') {
              this.router.navigate([this.router.url]);
            }
            this.result = true;
          }
          this.close();
        },
        (error) => {
          this.commonService.showToastV2Message(false, 'Archiving failed', 'fas fa-exclamation-circle', 'error');
          this.close();
        }
      );
    } else {
      this.close();
    }
  }
}
