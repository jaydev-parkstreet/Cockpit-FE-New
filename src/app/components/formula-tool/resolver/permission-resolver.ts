import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { formulaService } from "src/app/components/formula-tool/summary.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class PermissionResolver implements Resolve<any> {

    constructor(private formulaService: formulaService) {};

    resolve() {
        return this.formulaService.getPermission()
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
