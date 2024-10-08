import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageStatusScopeRoutingModule } from './page-status-scope-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';

import { PageStatusScopeComponent } from './page-status-scope.component';

@NgModule({
  imports: [
    CommonModule,
    PageStatusScopeRoutingModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
  ],
  declarations: [PageStatusScopeComponent]
})
export class PageStatusScopeModule {}
