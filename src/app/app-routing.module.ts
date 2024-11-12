import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/authentication/login-page/login-page.component';
import { MiddleComponent } from './components/authentication/middle/middle.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { ProductAddComponent } from './components/product-management/product-add/product-add.component';
import { ProductManagementDetailsComponent } from './components/product-management/product-management-details/product-management-details.component';
import { ApplicationComponent } from './components/layout/application/application.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: ApplicationComponent,
    children: [
      {
        path: '',
        redirectTo: 'product-management',
        pathMatch: 'full'
      },
      {
        path: 'product-management',
        children: [
              {
                path: '',
                component: ProductManagementComponent
              },
              {
                path: 'add',
                component: ProductAddComponent
              },
              {
                path: ':id',
                children:[
                  {
                    path: '',
                    component: ProductManagementDetailsComponent
                  },
                  {
                    path: 'add',
                    component: ProductAddComponent
                  },
                  {
                    path: 'edit',
                    component: ProductAddComponent
                  },
                  {
                    path: 'clone',
                    component: ProductAddComponent,
                    data: {
                      isDuplicate: true
                    }
                  }
                ]
              }]
      }]
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
