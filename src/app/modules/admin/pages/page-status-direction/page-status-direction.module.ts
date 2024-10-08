import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageStatusDirectionRoutingModule } from './page-status-direction-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

import { PageStatusDirectionComponent } from './page-status-direction.component';

@NgModule({
	imports: [
		CommonModule,
		PageStatusDirectionRoutingModule,
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
	],
	declarations: [
		PageStatusDirectionComponent,
	]
})
export class PageStatusDirectionModule { }
