import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application/application.component';

const routes: Routes = [
	{
		path: '',
		component: ApplicationComponent,
		children: [
			{
				path: '',
				redirectTo: '/product-management',
				pathMatch: 'full',
			},
			{
				path: 'product-management',
				loadChildren: () =>
					import('../product-management/product-management.module').then(
						(m) => m.ProductManagementModule
					),
			},
			{
				path: '',
				redirectTo: '/formula',
				pathMatch: 'full',
			},
			{
				path: 'formula',
				loadChildren: () =>
					import('../formula-tool/summary.module').then(
						(m) => m.SummaryModule
					),
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LayoutRoutingModule { }
