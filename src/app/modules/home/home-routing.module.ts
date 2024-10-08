import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from 'src/app/layout/app.layout.component';
import { GoalsComponent } from './pages/goals/goals.component';
import { OperationsComponent } from './pages/operations/operations.component';
import { EvaluationFormComponent } from './pages/evaluation/related-forms/evaluation-form.component';
import { EvaluationComponent } from './pages/evaluation/evaluation.component';
import { ScoringComponent } from './pages/scoring/scoring.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DateTestComponent } from './pages/date-test/date-test.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AppLayoutComponent,
        children: [
          {
            path: '',
            redirectTo: '/dashboard',
            pathMatch: 'full',
          },
          {
            path: 'dashboard',
            data: { breadcrumb: 'Anasayfa' },
            component: DashboardComponent,
          },
          {
            path: 'date-test',
            data: { breadcrumb: 'Date Test' },
            component: DateTestComponent,
          },
          {
            path: 'evaluation/list',
            data: { breadcrumb: 'Değerlendirmeler' },
            component: EvaluationComponent,
          },
          {
            path: 'evaluation/new',
            data: { breadcrumb: 'Değerlendirme Süreci Oluştur' },
            component: EvaluationFormComponent,
          },
          {
            path: 'evaluation/edit/:id',
            data: { breadcrumb: 'Değerlendirme Süreci Güncelle' },
            component: EvaluationFormComponent,
          },
          {
            path: 'performance/list',
            data: { breadcrumb: 'İşlemler' },
            component: OperationsComponent,
          },
          {
            path: 'performance/edit/:id',
            data: { breadcrumb: 'Hedefler' },
            component: GoalsComponent,
          },
          {
            path: 'performance/detail/:id',
            data: { breadcrumb: 'Performans Detay' },
            component: GoalsComponent, // Component is not ready
          },
          {
            path: 'scoring/:id',
            data: { breadcrumb: 'Değerlendirme' },
            component: ScoringComponent,
          },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
