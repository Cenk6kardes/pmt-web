import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CommonHttpService } from './common-http.service';

export interface TestData {
  date1: string;
  date2: string;
}
export interface DateTestResponse {
  success: boolean;
  message: string;
  data: TestData;
}

@Injectable({
  providedIn: 'root',
})
export class CoreApiService {
  private endPoint: string = 'Dashboard/menu';
  private isAsUserDropdownVisible$$ = new BehaviorSubject<boolean>(false);
  isAsUserDropdownVisible$!: Observable<boolean>;

  constructor(private commonHttpService: CommonHttpService) {
    this.isAsUserDropdownVisible$ = this.isAsUserDropdownVisible$$.asObservable();
  }

  getDynamicValue(): Observable<any> {
    return this.commonHttpService.get<any>(this.endPoint);
  }

  getDashboardWidget() {
    return this.commonHttpService.get<any>('Dashboard/list');
  }

  getCommonUserDetail() {
    return this.commonHttpService.get<any>('Common/User/detail').pipe(
      tap((res: any) => {
        const isVisible = res?.authFields?.DeveloperBar?.isVisible || false;
        this.isAsUserDropdownVisible$$.next(isVisible);
      })
    );
  }

  getDatesForTest(): Observable<TestData> {
    return this.commonHttpService.get<DateTestResponse>('Test/Date/DateGet')
      .pipe(
        map(res => res.data)
      );
  }

  setDatesForTest(dates: TestData): Observable<TestData> {
    return this.commonHttpService.post<TestData>('Test/Date/DatePost', dates);
  }
}
