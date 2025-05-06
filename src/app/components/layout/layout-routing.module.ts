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
				redirectTo: '/formula',
				pathMatch: 'full',
			},
			{
				path: 'formula',
				loadChildren: () =>
					import('../formula-tool/formula.module').then(
						(m) => m.FormulaSummaryModule
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
