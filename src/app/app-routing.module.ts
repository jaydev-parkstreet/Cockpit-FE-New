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
        path: '**',
        redirectTo: '/formula',
        pathMatch: 'full'
    },
    {
        path: 'formula',
        loadChildren: () => import('./components/formula-tool/formula.module').then(m => m.FormulaSummaryModule)
    }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
