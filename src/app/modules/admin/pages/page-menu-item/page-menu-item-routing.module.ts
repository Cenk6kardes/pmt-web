import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageMenuItemComponent } from './page-menu-item.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: PageMenuItemComponent },
	])],
	exports: [RouterModule]
})
export class PageMenuItemRoutingModule { }
