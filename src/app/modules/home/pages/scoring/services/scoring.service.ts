import { Injectable } from '@angular/core';
import { CommonHttpService } from './../../../../../core/services/common-http.service';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScoringService {
    private endPoint: string = 'scoring/detail';

    constructor(private commonHttpService: CommonHttpService) { }

    getScoringDetails(pageProcessId: string): Observable<any> {
      return this.commonHttpService.get<any>(`${this.endPoint}?PageProcessId=${pageProcessId}`);
    }

    updateScoringDetails(pageProcessId: string, body: any): Observable<any> {
      return this.commonHttpService.put<any>(`${this.endPoint}?PageProcessId=${pageProcessId}`, body);
    }
}
