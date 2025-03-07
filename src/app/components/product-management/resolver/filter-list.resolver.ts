import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProductManagementService } from "src/app/components/product-management/product-management.service";

@Injectable({
    providedIn: 'root'
})

export class FilterListResolver implements Resolve<any> {
    
    constructor(
        private productManagementService: ProductManagementService
    ) {};

    resolve() {
        const token = localStorage.getItem('authToken');
        return this.productManagementService.getDropdown(token)
        .then((response: any) => response.data)
        .catch(() => null);
    }
}
