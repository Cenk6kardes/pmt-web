import { Component, OnDestroy, OnInit } from '@angular/core';
import { OperationsService } from './services/operations.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Subscription, finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
})
export class OperationsComponent implements OnInit, OnDestroy {
  selectedColumns!: any[];
  teamDataSource: any[] = [];
  userDataSource: any[] = [];
  columnDefs: any[] = [];
  loading = true;
  teamPerformanceNotificationCount: string = '1';
  activeIndex: number = 0;

  private subscriptionList: Subscription = new Subscription();

  constructor(
    private operationsService: OperationsService,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.columnDefs = [
      { field: 'evaluationTitle', header: 'Değerlendirme' },
      { field: 'performanceSubject', header: 'Performans' },
      { field: 'period', header: 'Dönem' },
      { field: 'employeeFullName', header: 'Çalışan' },
      { field: 'managerFullName', header: 'Yönetici' },
      { field: 'directorship', header: 'Direktör' },
      { field: 'department', header: 'Departman' },
      { field: 'performanceAvgScore', header: 'Puan' },
      { field: 'performanceCompletionRate', header: 'Tamamlanma' },
      { field: 'statusComment', header: 'Not' },
      { field: 'status', header: 'Durum' },
    ];

    this.selectedColumns = this.columnDefs;
    this.tabChangeHandler(this.activeIndex);
    this.getOperations();
  }

  getOperations(): void {
    this.subscriptionList.add(
      this.operationsService
        .getOperations()
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.userDataSource = res?.data?.myPerformance?.performanceList || [];
            this.teamDataSource = res?.data?.teamPerformance?.performanceList || [];
            this.teamPerformanceNotificationCount = res?.data?.teamPerformance?.notificationCount || '';
          },
          error: (error) => {
            this.alertService.callMessage('error', 'İşlem Başarısız', 'Liste verileri yüklenemedi');
          }
        })
    );
  }

  onPage() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  get globalFilterFields() {
    return this.columnDefs.map((column) => column['field']);
  }

  tabChangeHandler(tabIndex: number) {
    if (tabIndex === 0) {
      this.selectedColumns = this.columnDefs.filter((column) => column.field !== 'directorship');
    } else {
      this.selectedColumns = this.columnDefs;
    }
  }

  goToDetail(path: string, pageProcessId: string) {
    if (pageProcessId) {
      this.router.navigate([path, pageProcessId]);
    }
  }
  goToScoring(path: string, pageProcessId: string, performanceSubject: string) {
    if (pageProcessId) {
      this.router.navigate([path, pageProcessId], { state: { data: { title: performanceSubject } } });
    }
  }

  ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
