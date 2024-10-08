import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageDetailComponent } from './page-detail.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: PageDetailComponent },
	])],
	exports: [RouterModule]
})
export class PageRoutingModule { }
