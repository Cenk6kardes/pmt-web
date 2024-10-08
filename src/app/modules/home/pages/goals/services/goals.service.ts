import { CommonHttpService } from './../../../../../core/services/common-http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoalsService {
  private endPoint: string = 'Performance/detail';

  constructor(private commonHttpService: CommonHttpService) {}

  getGoals(): Observable<any> {
    return this.commonHttpService.get<any>(this.endPoint);
  }

  getGoalById(pageProcessId: any): Observable<any> {
    return this.commonHttpService.get<any>(`${this.endPoint}?PageProcessId=${pageProcessId}`);
  }

  updateGoal(goal: any): Observable<any> {
    return this.commonHttpService.put<any>(this.endPoint, goal);
  }

  deleteGoal(goalId: number): Observable<any> {
    return this.commonHttpService.delete<any>(`${this.endPoint}/${goalId}`);
  }
}
