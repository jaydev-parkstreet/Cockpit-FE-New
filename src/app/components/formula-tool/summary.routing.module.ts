import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { formulaComponent } from './summary.component';
import { FilterListResolver } from './resolver/filter-list.resolver';
import { PermissionResolver } from 'src/app/components/formula-tool/resolver/permission-resolver';
import { FormulaDetailsComponent } from './formula-details/formula-details.component';
import { FormulaCrudComponent } from './formula-crud/formula-crud.component';

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
                component: formulaComponent
            },
            {
                path: 'add',
                component: FormulaCrudComponent,
                resolve: {
                    filterList: FilterListResolver
                }
            },
            {
                path: ':id',
                children: [
                    {
                        path: '',
                        component: FormulaDetailsComponent,
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
export class SummaryRoutingModule { }
