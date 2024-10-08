import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PagePeriodStatusComponent } from './page-period-status.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PagePeriodStatusComponent }])],
  exports: [RouterModule]
})
export class PagePeriodStatusRoutingModule {}
