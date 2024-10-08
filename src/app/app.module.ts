import { NgModule } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalRedirectComponent,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  ProtectedResourceScopes,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { RouterStateSnapshot } from '@angular/router';
import { CommonHttpService } from './core/services/common-http.service';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoginComponent } from './modules/home/pages/login/login.component';
import { GoalsComponent } from './modules/home/pages/goals/goals.component';
import { OperationsComponent } from './modules/home/pages/operations/operations.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { TranslocoRootModule } from './transloco-root.module';
import { ScoringComponent } from './modules/home/pages/scoring/scoring.component';
import { DashboardComponent } from './modules/home/pages/dashboard/dashboard.component';
import { EvaluationFormComponent } from './modules/home/pages/evaluation/related-forms/evaluation-form.component';
import { EvaluationComponent } from './modules/home/pages/evaluation/evaluation.component';
import { DayShiftPipe } from './core/pipes/day-shift.pipe';
import { HttpInterceptorService } from './core/interceptors/http.interceptor';
import { TagModule } from 'primeng/tag';
import { StepsModule } from 'primeng/steps';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListChartComponent } from './shared/components/list-chart/list-chart.component';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { ScoreHighlightDirective } from './core/directives/score-highlight.directive';
import { DescriptionDialogComponent } from './shared/components/description-dialog/description-dialog';

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: environment.authority,
      redirectUri: '/auth',
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {},
        logLevel: LogLevel.Verbose,
      },
    },
  });
}

function MsalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: (authService: MsalService, state: RouterStateSnapshot) => {
      return {
        scopes: ['user.read'],
        loginHint: state.root.queryParams['userId'] || undefined,
      };
    },
  };
}
function MsalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const myProtectedResourceMap = new Map<
    string,
    Array<string | ProtectedResourceScopes> | null
  >();

  myProtectedResourceMap.set(environment.myProtectedResourceMap, [
    {
      httpMethod: 'GET',
      scopes: ['user.read'],
    },
  ]);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap: myProtectedResourceMap,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GoalsComponent,
    OperationsComponent,
    EvaluationComponent,
    ScoringComponent,
    EvaluationFormComponent,
    DashboardComponent,
    DayShiftPipe,
    ListChartComponent,
    ScoreHighlightDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppLayoutModule,
    SharedModule,
    TranslocoRootModule,
    TagModule,
    StepsModule,
    AccordionModule,
    InputTextareaModule,
    BadgeModule,
    ListboxModule,
    DescriptionDialogComponent,
  ],
  providers: [
    CommonHttpService,
    MessageService,
    ConfirmationService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },  
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MsalGuardConfigFactory,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MsalInterceptorConfigFactory,
    },
    MsalService,
    MsalBroadcastService,
    MsalGuard,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
