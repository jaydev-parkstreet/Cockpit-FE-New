import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrls: ['./excel-export.component.scss']
})
export class ExcelExportComponent implements OnInit {
    downloading: boolean;
    @Input() config!: any;
    constructor(private commonService: CommonService, private changeDetectorRef: ChangeDetectorRef) { }

    ngOnInit(): void {}

    /**
     * Function to export in Excel
     * @author psi-enhancement
     */
    onExport(): void {
        this.downloading = true;
        this.commonService.exportExcel(this.config.apiUrl, this.config.params, () => {
            this.downloading = false;
            this.changeDetectorRef.detectChanges();
        });
    }
}
