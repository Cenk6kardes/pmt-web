import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageAuthorizationComponent } from './page-authorization.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageAuthorizationComponent },
	])],
	exports: [RouterModule]
})
export class PageAuthorizationRoutingModule { }
