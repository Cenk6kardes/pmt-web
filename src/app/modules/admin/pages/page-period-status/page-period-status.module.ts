import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PagePeriodStatusRoutingModule } from './page-period-status-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

import { PagePeriodStatusComponent } from './page-period-status.component';

@NgModule({
  imports: [
    CommonModule,
    PagePeriodStatusRoutingModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
  ],
  declarations: [PagePeriodStatusComponent]
})
export class PagePeriodStatusModule {}
