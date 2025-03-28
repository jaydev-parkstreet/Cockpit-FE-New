import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-table-card',
    templateUrl: './table-card.component.html',
    styleUrls: ['./table-card.component.scss']
})
export class TableCardComponent implements OnInit {
    @Input() rows: any;
    @Input() cardClass: string;

    constructor() { }

    ngOnInit(): void {
    }

}
