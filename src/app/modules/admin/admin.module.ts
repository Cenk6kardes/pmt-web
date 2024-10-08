import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';

import { provideTranslocoScope } from '@ngneat/transloco';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
  ],
  declarations: [],
  providers: [
    provideTranslocoScope({
      scope: 'admin',
    }),
  ],
})
export class AdminModule {}
