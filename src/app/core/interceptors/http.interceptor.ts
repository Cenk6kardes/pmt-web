import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { TranslocoService } from '@ngneat/transloco';

import { Observable, tap } from 'rxjs';
import { MenuService } from 'src/app/layout/app.menu.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private translocoService: TranslocoService, private menuService:MenuService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const changedUserEmail = sessionStorage.getItem('ChangedUserEmail');
    const todayDate = sessionStorage.getItem('TodayDate');
    const userLanguage = this.translocoService.getActiveLang();

    let headers = req.headers.set('User-Language', userLanguage);
    if (todayDate) {
      headers = headers.set('Today-Date', todayDate);
    }
    if (changedUserEmail) {
      headers = headers.set('Changed-User-Email', changedUserEmail);
    }

    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && clonedRequest.method === 'GET') {
          const description = event.body.description ? event.body.description : '';
          this.menuService.setDescription(description)
        }
      })
    );
  }
}
