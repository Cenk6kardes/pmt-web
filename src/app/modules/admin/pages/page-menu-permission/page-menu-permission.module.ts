import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageMenuPermissionRoutingModule } from './page-menu-permission-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

import { PageMenuPermissionComponent } from './page-menu-permission.component';

@NgModule({
  imports: [
    CommonModule,
    PageMenuPermissionRoutingModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
  ],
  declarations: [PageMenuPermissionComponent]
})
export class PageMenuPermissionModule {}
