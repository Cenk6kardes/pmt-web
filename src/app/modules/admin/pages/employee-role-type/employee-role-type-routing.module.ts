import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmployeeRoleTypeComponent } from './employee-role-type.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: EmployeeRoleTypeComponent }])],
  exports: [RouterModule]
})
export class EmployeeRoleTypeRoutingModule {}
