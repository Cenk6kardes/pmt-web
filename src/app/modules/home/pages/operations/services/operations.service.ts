import { CommonHttpService } from '../../../../../core/services/common-http.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationsService {
  private endPoint: string = 'Performance/list';

  constructor(private commonHttpService: CommonHttpService) {}

  getOperations(): Observable<any> {
    return this.commonHttpService.get<any>(`${this.endPoint}`);
  }

  getOperationByIds(operationId: number): Observable<any> {
    return this.commonHttpService.get<any>(`${this.endPoint}/${operationId}`);
  }

  createOperation(operation: any): Observable<any> {
    return this.commonHttpService.post<any>(this.endPoint, operation);
  }

  updateOperation(operationId: number, operation: any): Observable<any> {
    return this.commonHttpService.put<any>(
      `${this.endPoint}/${operationId}`,
      operation
    );
  }

  deleteOperation(operationId: number): Observable<any> {
    return this.commonHttpService.delete<any>(
      `${this.endPoint}/${operationId}`
    );
  }
}
