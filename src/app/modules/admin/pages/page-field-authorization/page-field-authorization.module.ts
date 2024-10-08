import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageFieldAuthorizationRoutingModule } from './page-field-authorization-routing.module';

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
import { ToggleButtonModule } from 'primeng/togglebutton';

import { PageFieldAuthorizationComponent } from './page-field-authorization.component';

@NgModule({
	imports: [
		CommonModule,
		PageFieldAuthorizationRoutingModule,
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
		ToggleButtonModule,
	],
	declarations: [
		PageFieldAuthorizationComponent,
	]
})
export class PageFieldAuthorizationModule { }
