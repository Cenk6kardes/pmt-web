import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PerformanceTemplatePeriodComponent } from './performance-template-period.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PerformanceTemplatePeriodComponent },
	])],
	exports: [RouterModule]
})
export class PerformanceTemplatePeriodRoutingModule { }
