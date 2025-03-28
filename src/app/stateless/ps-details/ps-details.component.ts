import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-ps-details',
    templateUrl: './ps-details.component.html',
    styleUrls: ['./ps-details.component.scss']
})
export class PsDetailsComponent implements OnInit {

    @Input() rowObjectKeysDetail: any;
    @Input() data: any;

    constructor() { }

    ngOnInit(): void {
    }

    /**
     * Checks if the specified key exists in either the current or previous data.
     * 
     * @param key
     * @returns boolean
     * 
     * @author PSI-Enhancement
     */
    hasData(key: string) {
        return (
            (this.data?.current_data?.[key] != undefined &&
                this.data?.current_data?.[key] !== '') ||
            (this.data?.previous_data?.[key] != undefined &&
                this.data?.previous_data?.[key] !== '')
        );
    }
}
