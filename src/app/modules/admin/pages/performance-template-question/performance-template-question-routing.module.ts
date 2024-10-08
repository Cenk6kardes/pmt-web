import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PerformanceTemplateQuestionComponent } from './performance-template-question.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PerformanceTemplateQuestionComponent },
	])],
	exports: [RouterModule]
})
export class PerformanceTemplateQuestionRoutingModule { }
