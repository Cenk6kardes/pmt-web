import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageMenuPermissionComponent } from './page-menu-permission.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PageMenuPermissionComponent }])],
  exports: [RouterModule]
})
export class PageMenuPermissionRoutingModule {}
