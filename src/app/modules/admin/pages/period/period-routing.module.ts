import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PeriodComponent } from './period.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PeriodComponent },
	])],
	exports: [RouterModule]
})
export class PeriodRoutingModule { }
