import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionScaleTypeComponent } from './question-scale-type.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: QuestionScaleTypeComponent },
	])],
	exports: [RouterModule]
})
export class QuestionScaleTypeRoutingModule { }
