import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonHttpService {
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  get<T>(endPoint: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + endPoint);
  }
  post<T>(endPoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.baseUrl + endPoint, body);
  }
  put<T>(endPoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.baseUrl + endPoint, body);
  }
  delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.baseUrl + endPoint);
  }
}
