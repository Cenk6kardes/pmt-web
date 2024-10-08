import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideTranslocoScope } from '@ngneat/transloco';

import { HomeRoutingModule } from './home-routing.module';
import { CalendarModule } from 'primeng/calendar';

import { DateTestComponent } from './pages/date-test/date-test.component';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, CalendarModule, FormsModule],
  declarations: [DateTestComponent],
  providers: [
    provideTranslocoScope({
      scope: 'home',
    }),
  ],
})
export class HomeModule {}
