import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PageAuthorizationRoutingModule } from './page-authorization-routing.module';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DropdownModule } from 'primeng/dropdown';

import { PageAuthorizationComponent } from './page-authorization.component';

@NgModule({
  imports: [
    CommonModule,
    PageAuthorizationRoutingModule,
    TableModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
		InputTextModule,
		InputNumberModule,
    DialogModule,
    DropdownModule,
    ToggleButtonModule,
  ],
  declarations: [PageAuthorizationComponent]
})
export class PageAuthorizationModule {}
