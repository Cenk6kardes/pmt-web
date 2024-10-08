import { Component, OnInit } from '@angular/core';
import { CoreApiService, TestData } from 'src/app/core/services/core-api.service';

@Component({
  selector: 'app-date-test',
  templateUrl: './date-test.component.html',
  styleUrls: ['./date-test.component.scss']
})
export class DateTestComponent implements OnInit {
  date1!: Date;
  date2!: Date;

  constructor(private careApiService: CoreApiService) {
    this.careApiService.getDatesForTest().subscribe({
      next: (dates: TestData) => {
        this.date1 = new Date(dates.date1);
        this.date2 = new Date(dates.date2);
      }
    });
  }

  ngOnInit(): void {
    console.log(this.date1, this.date2);
  }

  updateDates(): void {
    this.careApiService.setDatesForTest({
      date1: this.date1.toISOString(),
      date2: this.date2.toISOString()
    }).subscribe(console.log);
  }
}
