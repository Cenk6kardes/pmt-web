import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  switchMap,
  throwError,
} from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { MsalService } from '@azure/msal-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  jwtHelper = new JwtHelperService();
  baseUrl: string;
  constructor(private msalService: MsalService) {
    this.baseUrl = environment.baseUrl;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const id_token = localStorage.getItem('idToken');
    const access_token = localStorage.getItem('accessToken');
    if (id_token && access_token) {
      const transformedReq = request.clone({
        headers: request.headers
          // .set('Authorization', `Bearer ${id_token}`)
          .set('Authorization', `Bearer ${access_token}`),
      });
      return next.handle(transformedReq).pipe(
        catchError((res: any) => {
          if (res.status === 401 || res.status === 403) {
            const account = this.msalService.instance.getAllAccounts()[0];
            const accesTokenRequest = {
              scopes: ['user.read'],
              account: account,
            };

            return this.msalService.acquireTokenSilent(accesTokenRequest).pipe(
              switchMap((res: any) => {
                localStorage.setItem('idToken', res.idToken);
                localStorage.setItem('accessToken', res.accessToken);

                const transformedReq = request.clone({
                  headers: request.headers
                    // .set('Authorization', `Bearer ${res.idToken}`)
                    .set('Authorization', `Bearer ${res.accessToken}`),
                });
                return next.handle(transformedReq);
              })
            );
          } else {
            return throwError(res);
          }
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
