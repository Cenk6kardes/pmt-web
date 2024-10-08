import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { QuestionComponent } from './question.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: QuestionComponent }])],
  exports: [RouterModule]
})
export class QuestionRoutingModule {}
