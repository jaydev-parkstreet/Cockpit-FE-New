import { Routes } from '@angular/router';
import { Application } from './application/application';
import { Authentication } from './authentication/authentication';
import { HouseCashCredits } from './application/house-cash-credits/house-cash-credits';
import { Formula } from './application/formula/formula';

export const routes: Routes = [{
    path: 'login',
    component: Authentication
},
{
    path: '',
    component: Application,
    children: [{
        path: 'house-cash-credits',
        component: HouseCashCredits
    }, {
        path: 'formula',
        component: Formula
    }]
}];
