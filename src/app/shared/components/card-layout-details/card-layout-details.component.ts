import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-card-layout-details',
    templateUrl: './card-layout-details.component.html',
    styleUrls: ['./card-layout-details.component.scss']
})
export class CardLayoutDetailsComponent implements OnInit {
    @Input() parentCmpClass: string;
    @Input() rows: any;
    @Input() detailHeader: TemplateRef<any>;
    @Input() detailFooter: TemplateRef<any>;

    constructor() { }

    ngOnInit(): void {
    }

}
