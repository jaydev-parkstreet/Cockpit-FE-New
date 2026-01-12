import { Routes } from '@angular/router';
import { Application } from './application/application';
import { Authentication } from './authentication/authentication';

export const routes: Routes = [{
    path: 'login',
    component: Authentication
},
{
    path: '',
    component: Application
}];
