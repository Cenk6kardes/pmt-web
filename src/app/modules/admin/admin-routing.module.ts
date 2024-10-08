import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { adminPagesResolver } from './guards/resolve-functions';

import { AppLayoutComponent } from 'src/app/layout/app.layout.component';
import { EmptyFieldValue } from './models/empty-field-value.model';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: '/page',
            pathMatch: 'full'
          },
          {
            path: 'page',
            data: { breadcrumb: 'Sayfa Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/page/page.module').then((m) => m.PageModule)
          },
          {
            path: 'widget',
            data: { breadcrumb: 'Widget Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/widget/widget.module').then((m) => m.WidgetModule)
          },
          {
            path: 'employee',
            data: { breadcrumb: 'Çalışan Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/employee/employee.module').then((m) => m.EmployeeModule)
          },
          {
            path: 'pageauthorization',
            data: { breadcrumb: 'Sayfa Yetki Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-authorization/page-authorization.module').then((m) => m.PageAuthorizationModule)
          },
          {
            path: 'pageauthorizationstatus',
            data: { breadcrumb: 'Yetkili Sayfa Statü Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-auth-status/page-auth-status.module').then((m) => m.PageAuthStatusModule)
          },
          {
            path: 'pagestatus',
            data: { breadcrumb: 'Statü Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/page-status/page-status.module').then((m) => m.PageStatusModule)
          },
          {
            path: 'employeeroleassignment',
            data: { breadcrumb: 'Çalışan Rol Tanımları', id: EmptyFieldValue.STRING },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/employee-role-assignment/employee-role-assignment.module').then(
                (m) => m.EmployeeRoleAssignmentModule
              )
          },
          {
            path: 'pagefieldauthorization',
            data: { breadcrumb: 'Sayfa Alan Yetkilendirmeleri', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-field-authorization/page-field-authorization.module').then(
                (m) => m.PageFieldAuthorizationModule
              )
          },
          {
            path: 'widgetpermission',
            data: { breadcrumb: 'Widget Yetki Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/widget-permission/widget-permission.module').then((m) => m.WidgetPermissionModule)
          },
          {
            path: 'question',
            data: { breadcrumb: 'Soru Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/question/question.module').then((m) => m.QuestionModule)
          },
          {
            path: 'performancetemplate',
            data: { breadcrumb: 'Şablon Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/performance-template/performance-template.module').then(
                (m) => m.PerformanceTemplateModule
              )
          },
          {
            path: 'questiontype',
            data: { breadcrumb: 'Soru Tipi Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () => import('./pages/question-type/question-type.module').then((m) => m.QuestionTypeModule)
          },
          {
            path: 'questionscaletype',
            data: { breadcrumb: 'Cevap Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/question-scale-type/question-scale-type.module').then((m) => m.QuestionScaleTypeModule)
          },
          {
            path: 'performancecategory',
            data: { breadcrumb: 'Performans Kategori Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/performance-category/performance-category.module').then(
                (m) => m.PerformanceCategoryModule
              )
          },
          {
            path: 'performancetemplatequestion',
            data: { breadcrumb: 'Şablon Soruları', id: EmptyFieldValue.STRING },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/performance-template-question/performance-template-question.module').then(
                (m) => m.PerformanceTemplateQuestionModule
              )
          },
          {
            path: 'pagemenupermission',
            data: { breadcrumb: 'Menü Yetki Tanımları', id: EmptyFieldValue.STRING },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-menu-permission/page-menu-permission.module').then((m) => m.PageMenuPermissionModule)
          },
          {
            path: 'pagemenuitem',
            data: { breadcrumb: 'Menü Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-menu-item/page-menu-item.module').then((m) => m.PageMenuItemModule)
          },
          {
            path: 'questionscaletypevalue',
            data: { breadcrumb: 'Cevap Değer Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/question-scale-type-value/question-scale-type-value.module').then((m) => m.QuestionScaleTypeValueModule)
          },
          {
            path: 'pagestatusdirection',
            data: { breadcrumb: 'Süreç Statü Yön Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-status-direction/page-status-direction.module').then((m) => m.PageStatusDirectionModule)
          },          
          {
            path: 'questioncategory',
            data: { breadcrumb: 'Soru Kategori Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/question-category/question-category.module').then((m) => m.QuestionCategoryModule)
          },
          {
            path: 'period',
            data: { breadcrumb: 'Süreç Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/period/period.module').then((m) => m.PeriodModule)
          },
          {
            path: 'employeeunit',
            data: { breadcrumb: 'Departman Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/employee-unit/employee-unit.module').then((m) => m.EmployeeUnitModule)
          },
          {
            path: 'employeerole',
            data: { breadcrumb: 'Rol Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/employee-role/employee-role.module').then((m) => m.EmployeeRoleModule)
          },
          {
            path: 'employeeroletype',
            data: { breadcrumb: 'Çalışan Rol Tip Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/employee-role-type/employee-role-type.module').then((m) => m.EmployeeRoleTypeModule)
          },
          {
            path: 'pageperiodstatus',
            data: { breadcrumb: 'Süreç Statü Tanımları', id: EmptyFieldValue.UUID },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-period-status/page-period-status.module').then((m) => m.PagePeriodStatusModule)
          },
          {
            path: 'performancetemplateperiod',
            data: { breadcrumb: 'Performans Şablonu Dönem Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/performance-template-period/performance-template-period.module').then((m) => m.PerformanceTemplatePeriodModule)
          },
          {
            path: 'pagestatusscope',
            data: { breadcrumb: 'Statü Kapsamı Tanımları', id: EmptyFieldValue.NUMBER },
            resolve: { listData: adminPagesResolver },
            loadChildren: () =>
              import('./pages/page-status-scope/page-status-scope.module').then((m) => m.PageStatusScopeModule)
          },
          { path: '**', redirectTo: '/notfound' }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
