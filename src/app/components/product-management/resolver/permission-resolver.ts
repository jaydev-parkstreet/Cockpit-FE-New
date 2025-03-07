import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ProductManagementService } from "src/app/components/product-management/product-management.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class PermissionResolver implements Resolve<any> {
    
    constructor(private productManagementService: ProductManagementService) {};

    resolve() {
        return this.productManagementService.getPermission()
        .then((response: any) => {
            if (response && response.data && !response.data.permissions.Read) {
                window.location.href = environment.oldCockpit + '/router.php/dashboard';
                return null;
            }
            return response.data;
          })
        .catch(() => null);
    }
}