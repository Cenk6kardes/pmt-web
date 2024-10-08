import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionTypeComponent } from './question-type.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: QuestionTypeComponent },
	])],
	exports: [RouterModule]
})
export class QuestionTypeRoutingModule { }
