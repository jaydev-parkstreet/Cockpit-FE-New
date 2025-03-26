import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './main-header/main-header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { ApplicationComponent } from './application/application.component';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';

@NgModule({
	declarations: [
		ApplicationComponent,
		SidebarMenuComponent,
		MainHeaderComponent,
		FooterComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		NgxSpinnerModule,
		RouterModule,
		LayoutRoutingModule
	],
	exports: [
		ApplicationComponent,
		SidebarMenuComponent,
		MainHeaderComponent,
		FooterComponent
	]
})
export class LayoutModule { }
