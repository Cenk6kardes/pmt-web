import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageStatusComponent } from './page-status.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageStatusComponent },
	])],
	exports: [RouterModule]
})
export class PageStatusRoutingModule { }
