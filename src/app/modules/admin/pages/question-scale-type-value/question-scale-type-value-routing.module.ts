import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionScaleTypeValueComponent } from './question-scale-type-value.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: QuestionScaleTypeValueComponent },
	])],
	exports: [RouterModule]
})
export class QuestionScaleTypeValueRoutingModule { }
