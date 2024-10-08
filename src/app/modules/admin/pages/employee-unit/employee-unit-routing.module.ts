import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EmployeeUnitComponent } from './employee-unit.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: EmployeeUnitComponent }])],
  exports: [RouterModule]
})
export class EmployeeUnitRoutingModule {}
