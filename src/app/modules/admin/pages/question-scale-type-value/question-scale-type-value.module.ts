import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuestionScaleTypeValueRoutingModule } from './question-scale-type-value-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { DropdownModule } from 'primeng/dropdown';


import { QuestionScaleTypeValueComponent } from './question-scale-type-value.component';

@NgModule({
	imports: [
		CommonModule,
		QuestionScaleTypeValueRoutingModule,
		TableModule,
		ReactiveFormsModule,
		ButtonModule,
		RippleModule,
		ToastModule,
		ToolbarModule,
		InputTextModule,
		InputNumberModule,
		DialogModule,
		TabViewModule,
		DropdownModule,
	],
	declarations: [
		QuestionScaleTypeValueComponent,
	]
})
export class QuestionScaleTypeValueModule { }
