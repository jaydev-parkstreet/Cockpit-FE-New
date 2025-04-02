import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { summaryComponent } from './summary.component';
import { FilterListResolver } from './resolver/filter-list.resolver';
import { PermissionResolver } from 'src/app/components/formula-tool/resolver/permission-resolver';

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
                component: summaryComponent
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SummaryRoutingModule { }
