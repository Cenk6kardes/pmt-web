import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageAuthStatusRoutingModule } from './page-auth-status-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from "primeng/dropdown";

import { PageAuthStatusComponent } from './page-auth-status.component';

@NgModule({
	imports: [
		CommonModule,
		PageAuthStatusRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		DialogModule,
		DropdownModule,
	],
	declarations: [
		PageAuthStatusComponent,
	]
})
export class PageAuthStatusModule { }
