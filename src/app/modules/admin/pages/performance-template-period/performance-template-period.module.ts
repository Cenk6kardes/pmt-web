import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PerformanceTemplatePeriodRoutingModule } from './performance-template-period-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';


import { PerformanceTemplatePeriodComponent } from './performance-template-period.component';

@NgModule({
	imports: [
		CommonModule,
		PerformanceTemplatePeriodRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		InputNumberModule,
		DialogModule,
		DropdownModule,
		ToggleButtonModule,
	],
	declarations: [
		PerformanceTemplatePeriodComponent,
	]
})
export class PerformanceTemplatePeriodModule { }
