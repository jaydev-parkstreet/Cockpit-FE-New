import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { formulaService } from "src/app/components/formula-tool/summary.service";

@Injectable({
    providedIn: 'root'
})

export class FilterListResolver implements Resolve<any> {
    
    constructor(
        private formulaService: formulaService
    ) {};

    resolve() {
        const token = localStorage.getItem('authToken');
        return this.formulaService.getDropdown(token)
        .then((response: any) => response.data)
        .catch(() => null);
    }
}
