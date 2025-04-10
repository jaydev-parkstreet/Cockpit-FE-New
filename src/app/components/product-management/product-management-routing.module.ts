import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from './product-management.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductManagementDetailsComponent } from './product-management-details/product-management-details.component';
import { FilterListResolver } from './resolver/filter-list.resolver';
import { PermissionResolver } from 'src/app/components/product-management/resolver/permission-resolver';

const routes: Routes = [
    {
        path: '',
        resolve: {
            filterList: FilterListResolver,
            permissions: PermissionResolver
        },
        children: [
            {
                path: '',
                component: ProductManagementComponent
            },
            {
                path: 'add',
                component: ProductAddComponent,
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        component: ProductManagementDetailsComponent,
                    },
                    {
                        path: 'edit',
                        component: ProductAddComponent,
                    },
                    {
                        path: 'clone',
                        component: ProductAddComponent,
                        data: { isDuplicate: true },
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductManagementRoutingModule { }
