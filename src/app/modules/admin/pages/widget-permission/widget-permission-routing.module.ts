import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { WidgetPermissionComponent } from './widget-permission.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: WidgetPermissionComponent },
	])],
	exports: [RouterModule]
})
export class WidgetPermissionRoutingModule { }
