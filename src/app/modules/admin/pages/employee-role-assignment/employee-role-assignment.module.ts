import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { EmployeeRoleAssignmentRoutingModule } from './employee-role-assignment-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';

import { EmployeeRoleAssignmentComponent } from './employee-role-assignment.component';


@NgModule({
	imports: [
		CommonModule,
		EmployeeRoleAssignmentRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		DialogModule,
		TabViewModule,
		DropdownModule,
	],
	declarations: [
		EmployeeRoleAssignmentComponent,
	]
})
export class EmployeeRoleAssignmentModule { }
