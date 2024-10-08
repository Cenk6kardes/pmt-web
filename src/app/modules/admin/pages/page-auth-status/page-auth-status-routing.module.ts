import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageAuthStatusComponent } from './page-auth-status.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageAuthStatusComponent },
	])],
	exports: [RouterModule]
})
export class PageAuthStatusRoutingModule { }
