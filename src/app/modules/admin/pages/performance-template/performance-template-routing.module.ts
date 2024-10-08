import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PerformanceTemplateComponent } from './performance-template.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PerformanceTemplateComponent },
	])],
	exports: [RouterModule]
})
export class PerformanceTemplateRoutingModule { }
