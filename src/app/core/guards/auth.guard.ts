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

export const authCanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean | any => {
  const router = inject(Router);
  const msalBroadcastService = inject(MsalBroadcastService);
  const msalService = inject(MsalService);

  if(msalService.instance.getAllAccounts().length > 0){
    router.navigate(['/']);
  }

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
      if (msalService.instance.getAllAccounts().length <= 0) {
        return of(false);
      }
      router.navigate(['/']);
      return of(true);
    });
};
