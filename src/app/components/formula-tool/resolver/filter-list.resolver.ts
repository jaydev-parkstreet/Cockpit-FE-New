import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { FormulaService } from "src/app/components/formula-tool/formula.service";

@Injectable({
    providedIn: 'root'
})

export class FilterListResolver implements Resolve<any> {
    
    constructor(
        private FormulaService: FormulaService
    ) {};

    resolve() {
        const token = localStorage.getItem('authToken');
        return this.FormulaService.getDropdown(token)
        .then((response: any) => response.data)
        .catch(() => null);
    }
}
