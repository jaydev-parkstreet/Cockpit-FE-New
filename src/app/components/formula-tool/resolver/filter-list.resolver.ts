import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { summaryService } from "src/app/components/formula-tool/summary.service";

@Injectable({
    providedIn: 'root'
})

export class FilterListResolver implements Resolve<any> {
    
    constructor(
        private summaryService: summaryService
    ) {};

    resolve() {
        const token = localStorage.getItem('authToken');
        return this.summaryService.getDropdown(token)
        .then((response: any) => response.data)
        .catch(() => null);
    }
}
