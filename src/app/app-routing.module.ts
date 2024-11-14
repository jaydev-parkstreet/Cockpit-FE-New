import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/authentication/login-page/login-page.component';
import { MiddleComponent } from './components/authentication/middle/middle.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { ProductAddComponent } from './components/product-management/product-add/product-add.component';
import { ProductManagementDetailsComponent } from './components/product-management/product-management-details/product-management-details.component';
import { ApplicationComponent } from './components/layout/application/application.component';
import { FilterListResolver } from './core/resolver/filter-list.resolver';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./components/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: 'product-management',
    loadChildren: () => import('./components/product-management/product-management.module').then(m => m.ProductManagementModule)
  },
  {
    path: 'middle',
    component: MiddleComponent
  },
  {
    path: '**',
    redirectTo: '/product-management',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
