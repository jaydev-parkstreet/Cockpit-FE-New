import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-header-tool',
  templateUrl: './header-tool.component.html',
  styleUrls: ['./header-tool.component.scss']
})
export class HeaderToolComponent implements OnInit {
    oldCockpitPMSTool : string = environment.oldCockpit +"/router.php/app#!/cockpit/product-management";;
    @Input() titleText: string;
    @Input() titleIcon: string;

    constructor(private commonSpinner: CommonService) { }

    ngOnInit(): void { }

    redirectToOldCockpit(event: Event) {
        event.preventDefault();
        this.commonSpinner.showSpinner();
        window.location.href = this.oldCockpitPMSTool;
        setTimeout(() => {
            this.commonSpinner.hideSpinner();
        }, 3000)
    }
}
