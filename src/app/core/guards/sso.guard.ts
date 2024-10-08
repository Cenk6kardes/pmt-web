import { EventType, EventMessage } from '@azure/msal-browser';
import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Observable, filter, of } from 'rxjs';

export const ssoCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean | any => {
  const router = inject(Router);
  const msalBroadcastService = inject(MsalBroadcastService);
  const msalService = inject(MsalService);

  msalBroadcastService.msalSubject$
    .pipe(
      filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
    )
    .subscribe((data) => {
      const authResult: any = data.payload;
      if (authResult) {
        localStorage.setItem('idToken', authResult.idToken);
        localStorage.setItem('accessToken', authResult.accessToken);
      }
    });

  return msalBroadcastService.inProgress$.subscribe((data) => {
    if (msalService.instance.getAllAccounts().length <= 0) {
      router.navigate(['/login']);
      return of(false);
    }
    return of(true);
  });
};
