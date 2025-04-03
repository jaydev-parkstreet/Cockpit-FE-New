import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './components/authentication/login-page/login-page.component';
import { AuthGuard } from './components/authentication/auth.guard';

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
        path: '**',
        redirectTo: '/product-management',
        pathMatch: 'full'
    },
    {
        path: 'formula',
        loadChildren: () => import('./components/formula-tool/summary.module').then(m => m.FormulaSummaryModule)
    },
    {
        path: '**',
        redirectTo: '/formula',
        pathMatch: 'full'
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
