import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmployeeRoleAssignmentComponent } from './employee-role-assignment.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EmployeeRoleAssignmentComponent },
	])],
	exports: [RouterModule]
})
export class EmployeeRoleAssignmentRoutingModule { }
