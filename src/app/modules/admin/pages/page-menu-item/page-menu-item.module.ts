import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageMenuItemRoutingModule } from './page-menu-item-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';

import { PageMenuItemComponent } from './page-menu-item.component';

@NgModule({
	imports: [
		CommonModule,
		PageMenuItemRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		InputNumberModule,
		DialogModule,
		TabViewModule,
		DropdownModule,
	],
	declarations: [
		PageMenuItemComponent,
	]
})
export class PageMenuItemModule { }
