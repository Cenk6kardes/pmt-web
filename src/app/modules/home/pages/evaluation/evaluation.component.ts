import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription, finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { EvaluationService } from './services/evaluation.service';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss'],
})
export class EvaluationComponent implements OnInit, OnDestroy {
  dataSource: any[] = [];
  columnDefs: any[] = [];
  menuItems: MenuItem[] | undefined;
  loading = true;

  evaluationForm!: FormGroup;

  pageProcessId!: number;
  selectedColumns!: any[];
  private subscriptionList: Subscription = new Subscription();

  constructor(
    private alertService: AlertService,
    private evaluationService: EvaluationService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.columnDefs = [
      { field: 'createdDate', header: 'Kayıt Tarihi' },
      { field: 'title', header: 'Değerlendirme Süreci' },
      { field: 'completionRate', header: 'İlerleme' },
      { field: 'status', header: 'Durum' },
      { field: 'startDate', header: 'Başlangıç Tarihi' },
      { field: 'endDate', header: 'Bitiş Tarihi' },
    ];


    this.selectedColumns = this.columnDefs;
    this.getEvaluation();
  }

  getEvaluation(): void {
    this.subscriptionList.add(
      this.evaluationService
        .getEvaluations()
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.dataSource = res.data;
          },
          error: (error) => {
            this.alertService.callMessage(
              'error',
              'İşlem Başarısız',
              'Liste verileri yüklenemedi'
            );
          },
        })
    );
  }

  selectRow(rowData:any){
    this.getMenuItems(rowData);
  }

  getMenuItems(rowData: any) {
    const pageProcessId = rowData.pageProcessId;
    
    if (rowData.menuStatuses && rowData.menuStatuses.length > 0) {
      this.menuItems = rowData.menuStatuses.map((menu: any) => ({
        ...menu,
        label: menu.status,
        pageProcessId,
        command: (data: any) => {
          this.handleOverlayMenu(data.item.pageProcessId, data.item.id);
        },
      }));
    }
  }

  handleOverlayMenu(pageProcessId: any, pagePeriodStatusId: string): void {
    this.loading = true;
    this.subscriptionList.add(
      this.evaluationService
        .handleOverlayMenu(pageProcessId, pagePeriodStatusId)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              const index = this.dataSource.findIndex(item => item.pageProcessId === pageProcessId);
              this.dataSource[index].menuStatuses = [];
              this.getEvaluation();
            }
          },
          error: (error) => {
            this.alertService.callMessage(
              'error',
              'İşlem Başarısız',
              'Liste verileri yüklenemedi'
            );
          },
        })
    );
  }

  get globalFilterFields() {
    return this.columnDefs.map((column) => column['field']);
  }

  onPage() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  goToDetail(pageProcessId: number) {
    this.router.navigate(['/evaluation/edit', pageProcessId]);
  }

  getStatusColor(status: number) {
    switch (status) {
      case 7:
        return "warning";
      case 10:
        return "success";
      case 12:
        return "danger";
      default:
        return "contrast";
    }
  }

  ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
