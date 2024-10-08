import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PerformanceCategoryComponent } from './performance-category.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: PerformanceCategoryComponent }])],
  exports: [RouterModule]
})
export class PerformanceCategoryRoutingModule {}
