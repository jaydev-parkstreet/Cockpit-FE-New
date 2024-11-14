import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from './product-management.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductManagementDetailsComponent } from './product-management-details/product-management-details.component';
import { FilterListResolver } from '../../core/resolver/filter-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductManagementComponent,
    resolve: {
      filterList: FilterListResolver  
    }
  },
  {
    path: 'add',
    component: ProductAddComponent,
    resolve: {
      filterList: FilterListResolver  
    }
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
        resolve: {
          filterList: FilterListResolver  
        }
      },
      {
        path: 'clone',
        component: ProductAddComponent,
        data: { isDuplicate: true },
        resolve: {
          filterList: FilterListResolver  
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class ProductManagementRoutingModule {}

