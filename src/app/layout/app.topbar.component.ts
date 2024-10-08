import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { LoggedInUser } from '../core/models/loggedInUser';
import {  TranslocoService } from '@ngneat/transloco';
import { CoreApiService } from '../core/services/core-api.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopbarComponent implements OnInit {
  @ViewChild('menubutton') menuButton!: ElementRef;
  isAuthenticated = false;
  activeUser: string | undefined = 'unknown user';
  todayDate: Date | null = null;
  users = [
    {
      email: "test.ozge.dumlu@orioninc.com",
      value: "test.ozge.dumlu@orioninc.com",
    },
    {
      email: "test.can.urek@orioninc.com",
      value: "test.can.urek@orioninc.com",
    },
    {
      email: "test.eda.tokmak@orioninc.com",
      value: "test.eda.tokmak@orioninc.com",
    },
    {
      email: "test.melih.eran@orioninc.com",
      value: "test.melih.eran@orioninc.com",
    },
    {
      email: "test.burak.salk@orioninc.com",
      value: "test.burak.salk@orioninc.com",
    },
    {
      email: "test.ceyda.ulker@orioninc.com",
      value: "test.ceyda.ulker@orioninc.com",
    }
  ];

  activeAccount!: any;
  loggedInUserData!: LoggedInUser;
  languages!: any[];
  activeLanguage!: { name: string; code: string };
  isProd = false;
  isAsUserDropdownVisible!: Observable<boolean>;
  activeUserEmail = '';
  changedUserEmail = '';

  constructor(
    public layoutService: LayoutService,
    private msalService: MsalService,
    private auth: AuthenticationService,
    private translocoService: TranslocoService,
    private coreApiService: CoreApiService,
  ) {
    this.coreApiService.getCommonUserDetail().subscribe();
  }

  ngOnInit(): void {
    this.getActiveUser();
    this.getTodayDate();

    this.isProd = environment.production;
    this.languages = [
      { name: 'Turkish', code: 'tr' },
      { name: 'English', code: 'uk' }
    ];

    this.isAsUserDropdownVisible = this.coreApiService.isAsUserDropdownVisible$;
  }

  setTodayDate(event: Date) {
    sessionStorage.setItem('TodayDate', event.toISOString());
    window.location.reload();
  }

  getTodayDate() {
    const savedDate = sessionStorage.getItem('TodayDate');
    if (savedDate) {
      this.todayDate = new Date(savedDate);
    }
  }

  clearTodayDate() {
    sessionStorage.removeItem('TodayDate');
    window.location.reload();
  }

  getActiveUser() {
    this.activeAccount = this.msalService.instance.getActiveAccount();
    this.changedUserEmail = sessionStorage.getItem('ChangedUserEmail') || '';
    this.activeUserEmail = this.changedUserEmail;

    if (this.changedUserEmail) this.users.unshift({ email: this.activeAccount.username, value: '' });

    if (!this.activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      this.activeAccount = this.msalService.instance.getAllAccounts()[0];

      this.msalService.instance.setActiveAccount(this.activeAccount);
    }

    this.isAuthenticated = this.activeAccount ? true : false;
    this.activeUser = this.activeAccount?.name;
  }

  changeActiveUser(user: any): void {
    this.changedUserEmail = sessionStorage.getItem('ChangedUserEmail') || '';
    this.activeUserEmail = this.changedUserEmail;

    if (user) {
      this.users.unshift({ email: this.activeAccount.username, value: '' });
      sessionStorage.setItem('ChangedUserEmail', user);
    } else {
      sessionStorage.removeItem('ChangedUserEmail');
      this.users.shift();
    }

    window.location.reload();
  }

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  logout(): void {
    this.auth.logout();
  }

  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }

  changeActiveLanguageHandler(langType: any) {
    langType = langType == 'uk' ? 'en' : langType;
    this.translocoService.setActiveLang(langType);
  }
}
