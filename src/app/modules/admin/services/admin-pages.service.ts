import { Injectable } from '@angular/core';

import { CommonHttpService } from 'src/app/core/services/common-http.service';

import { IRequest, IResponse } from 'src/app/core/models/generic-types';

import {  map, Observable } from 'rxjs';

@Injectable({ providedIn: 'any' })
export class AdminPagesService {
  constructor(private readonly commonHttpService: CommonHttpService) {}


  // Use this method only for getting dropdown data
  getList<T>(path: string): Observable<T> {
    return this.commonHttpService
      .get<IResponse<T>>(`Admin/${path}/list`)
      .pipe(map((response: IResponse<T>) => response.data));
  }

  getItem<T>(id: number | string, path: string): Observable<T> {
    let urlParams = '?';

    if (typeof id === 'string' && id.includes('=')) {
      urlParams += id;
    } else {
      urlParams += 'Id=' + id;
    }
    return this.commonHttpService
      .get<IResponse<T>>(`Admin/${path}/detail${urlParams}`)
      .pipe(map((response: IResponse<T>) => response.data));
  }

  createItem<T>(data: IRequest<T>, path: string): Observable<boolean | null> {
    return this.commonHttpService
      .post<IResponse<boolean>>(`Admin/${path}/detail`, data)
      .pipe(map((response: IResponse<boolean | null>) => response.data));
  }

  editItem<T>(data: IRequest<T>, path: string): Observable<boolean | null> {
    return this.commonHttpService
      .put<IResponse<boolean | null>>(`Admin/${path}/detail`, data)
      .pipe(map((response: IResponse<boolean | null>) => response.data));
  }

  deleteItem(id: number | string, path: string): Observable<boolean | null> {
    let urlParams = '?';

    if (typeof id === 'string' && id.includes('=')) {
      urlParams += id;
    } else {
      urlParams += 'Id=' + id;
    }
    return this.commonHttpService
      .delete<IResponse<boolean | null>>(`Admin/${path}/detail${urlParams}`)
      .pipe(map((response: IResponse<boolean | null>) => response.data));
  }
}
