import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoutingModule } from './employee-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';

import { EmployeeComponent } from './employee.component';
import { ManagerEmployeePipe } from 'src/app/core/pipes/manager-employee.pipe';

@NgModule({
	imports: [
		CommonModule,
		EmployeeRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		DialogModule,
		DropdownModule,
		InputTextareaModule,
		SelectButtonModule,
		TagModule,
		CalendarModule,
	],
	declarations: [
		EmployeeComponent,
		ManagerEmployeePipe,
	]
})
export class EmployeeModule { }
