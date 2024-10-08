import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionCategoryComponent } from './question-category.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: QuestionCategoryComponent },
	])],
	exports: [RouterModule]
})
export class QuestionCategoryRoutingModule { }
