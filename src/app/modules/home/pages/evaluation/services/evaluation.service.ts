import { CommonHttpService } from '../../../../../core/services/common-http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  private endPoint: string = 'Evaluation';

  constructor(private commonHttpService: CommonHttpService) {}

  getEvaluations(): Observable<any> {
    return this.commonHttpService.get<any>(`${this.endPoint}/list`);
  }

  getEvaluationDetails(pageProcessId: any): Observable<any> {
    return this.commonHttpService.get<any>(
      `${this.endPoint}/detail${
        pageProcessId ? '?PageProcessId=' + pageProcessId : ''
      }`
    );
  }

  updateEvaluationForm(data: any): Observable<any> {
    return this.commonHttpService.put<any>(`${this.endPoint}/detail`, data);
  }

  createEvaluationForm(data: any): Observable<any> {
    return this.commonHttpService.post<any>(`${this.endPoint}/detail`, data);
  }

  handleOverlayMenu(
    pageProcessId: number,
    pagePeriodStatusId: any
  ): Observable<any> {
    const body = { pageProcessId, pagePeriodStatusId };
    
    return this.commonHttpService.put<any>(
      `${this.endPoint}/menu-status`,
      body
    );
  }
}
