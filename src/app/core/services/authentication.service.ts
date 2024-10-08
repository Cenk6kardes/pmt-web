import { Inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import {
  MsalGuardConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MsalBroadcastService,
} from '@azure/msal-angular';
import { RedirectRequest, EventType, EventMessage } from '@azure/msal-browser';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  jwtHelper = new JwtHelperService();
  isAssignedBuyer = new BehaviorSubject<boolean>(false);
  userEndpoint = 'user';
  private loginSuccessSubject = new BehaviorSubject<boolean>(false);
  loginSucess$ = this.loginSuccessSubject.asObservable();

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private msalBroadcastService: MsalBroadcastService
  ) {
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS)
      )
      .subscribe((data) => {
        const authResult: any = data.payload;
        if (authResult) {
          localStorage.setItem('idToken', authResult.idToken);
          localStorage.setItem('accessToken', authResult.accessToken);
        }
        this.loginSuccessSubject.next(true);
        router.navigateByUrl('/');
        return false;
      });
  }

  async login() {
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({
        ...this.msalGuardConfig.authRequest,
      } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  logout() {
    this.msalService.logoutRedirect();
    localStorage.clear();
  }

/*   async validateToken(redirectUrl?: string): Promise<boolean | UrlTree> {
    const accounts = this.msalService.instance.getAllAccounts();

    if (accounts.length <= 0 && redirectUrl !== '/login') {
      this.router.navigate(['/login']);
      return false;
    }

    if (accounts.length <= 0 && redirectUrl === '/login') {
      return true;
    }

    if (accounts.length > 0) {
      try {
        const response = await this.msalService.instance.acquireTokenSilent({
          account: accounts[0],
          scopes: ['user.read'],
        });

        if (response) {
          localStorage.setItem('idToken', response.idToken);
          localStorage.setItem('accessToken', response.accessToken);
        }

        if (redirectUrl === '/login') {
          this.router.navigateByUrl('/');
          return false;
        }
        return true;
      } catch (error) {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return false;
    }
  } */
}
