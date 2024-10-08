import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageStatusDirectionComponent } from './page-status-direction.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageStatusDirectionComponent },
	])],
	exports: [RouterModule]
})
export class PageStatusDirectionRoutingModule { }
