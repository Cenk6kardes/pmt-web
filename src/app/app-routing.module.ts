import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { authCanActivateGuard } from './core/guards/auth.guard';
import { LoginComponent } from './modules/home/pages/login/login.component';
import { EvaluationFormComponent } from './modules/home/pages/evaluation/related-forms/evaluation-form.component';
import { ssoCanActivateGuard } from './core/guards/sso.guard';
import { ScoringComponent } from './modules/home/pages/scoring/scoring.component';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
};

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Anasayfa' },
    canActivate: [ssoCanActivateGuard],
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'evaluation',
    data: { breadcrumb: 'Değerlendirme' },
    canActivate: [ssoCanActivateGuard],
    component: EvaluationFormComponent,
  },
  {
    path: 'scoring',
    data: { breadcrumb: 'Puanlama' },
    canActivate: [ssoCanActivateGuard],
    component: ScoringComponent,
  },
  {
    path: 'admin',
    data: { breadcrumb: 'Yönetim' },
    canActivate: [ssoCanActivateGuard],
    loadChildren: () => 
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'login',
    canActivate: [authCanActivateGuard],
    component: LoginComponent,
  },
  {
    path: 'notfound',
    loadChildren: () =>
      import('./modules/demo/components/notfound/notfound.module').then(
        (m) => m.NotfoundModule
      ),
  },
  {
    path: 'demo',
    component: AppLayoutComponent,
    canActivate: [authCanActivateGuard],
    canActivateChild: [authCanActivateGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/demo/components/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
      {
        path: 'uikit',
        data: { breadcrumb: 'UI Kit' },
        loadChildren: () =>
          import('./modules/demo/components/uikit/uikit.module').then(
            (m) => m.UIkitModule
          ),
      },
      {
        path: 'utilities',
        data: { breadcrumb: 'Utilities' },
        loadChildren: () =>
          import('./modules/demo/components/utilities/utilities.module').then(
            (m) => m.UtilitiesModule
          ),
      },
      {
        path: 'pages',
        data: { breadcrumb: 'Pages' },
        loadChildren: () =>
          import('./modules/demo/components/pages/pages.module').then(
            (m) => m.PagesModule
          ),
      },
      {
        path: 'profile',
        data: { breadcrumb: 'User Management' },
        loadChildren: () =>
          import('./modules/demo/components/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'documentation',
        data: { breadcrumb: 'Documentation' },
        loadChildren: () =>
          import(
            './modules/demo/components/documentation/documentation.module'
          ).then((m) => m.DocumentationModule),
      },
      {
        path: 'blocks',
        data: { breadcrumb: 'Prime Blocks' },
        loadChildren: () =>
          import(
            './modules/demo/components/primeblocks/primeblocks.module'
          ).then((m) => m.PrimeBlocksModule),
      },
      {
        path: 'ecommerce',
        data: { breadcrumb: 'E-Commerce' },
        loadChildren: () =>
          import('./modules/demo/components/ecommerce/ecommerce.module').then(
            (m) => m.EcommerceModule
          ),
      },
      {
        path: 'apps',
        data: { breadcrumb: 'Apps' },
        loadChildren: () =>
          import('./modules/demo/components/apps/apps.module').then(
            (m) => m.AppsModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
