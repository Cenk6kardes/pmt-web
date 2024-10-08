import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageStatusScopeComponent } from './page-status-scope.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PageStatusScopeComponent }])],
  exports: [RouterModule]
})
export class PageStatusScopeRoutingModule {}
