import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageFieldAuthorizationComponent } from './page-field-authorization.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageFieldAuthorizationComponent },
	])],
	exports: [RouterModule]
})
export class PageFieldAuthorizationRoutingModule { }
