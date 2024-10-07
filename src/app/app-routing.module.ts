import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/authentication/login-page/login-page.component';
import { MiddleComponent } from './components/authentication/middle/middle.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AuthGuard } from './components/authentication/auth.guard';
import { ProductManagementDetailsComponent } from './components/product-management/product-management-details/product-management-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'middle', component: MiddleComponent },
  {
    path: 'product-management',
    component: ProductManagementComponent,
    canActivate: [AuthGuard],
  },
  { path: 'product-management/:id', component:ProductManagementDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
