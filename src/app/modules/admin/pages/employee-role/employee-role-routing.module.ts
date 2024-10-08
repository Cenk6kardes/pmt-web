import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmployeeRoleComponent } from './employee-role.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: EmployeeRoleComponent },
	])],
	exports: [RouterModule]
})
export class EmployeeRoleRoutingModule { }
