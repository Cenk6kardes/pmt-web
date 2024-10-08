import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IPerformanceTemplatePeriodItem } from '../../models/performance-template-period.model';
import { IPerformanceTemplateItem } from '../../models/performance-template.model';
import { IPeriodItem } from '../../models/period.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  templateUrl: './performance-template-period.component.html',
  styleUrls: ['./performance-template-period.component.scss'],
  providers: [MessageService]
})
export class PerformanceTemplatePeriodComponent implements OnInit, OnDestroy {
  pageHeader = 'Performans Şablonu Dönem Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPerformanceTemplatePeriodItem[] = [];
  itemDefaults: IPerformanceTemplatePeriodItem = {
    id: 0,
    performanceTemplateId: '',
    performanceTemplate: '',
    periodId: null,
    period: '',
    isRequired: true,
    orderId: 0
  };
  item: IPerformanceTemplatePeriodItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    performanceTemplateId: [this.item.performanceTemplateId, Validators.required],
    periodId: [this.item.periodId, Validators.required],
    orderId: [this.item.orderId, Validators.required],
    isRequired: [this.item.isRequired, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'performancetemplateperiod';
  pageLabel: string = 'titleTR';

  performanceTemplateList$: Observable<IPerformanceTemplateItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPerformanceTemplateItem>>('performancetemplate')
    .pipe(map((response: AdminDataGeneric<IPerformanceTemplateItem>) => response.list));
  periodList$: Observable<IPeriodItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPeriodItem>>('period')
    .pipe(map((response: AdminDataGeneric<IPeriodItem>) => response.list));

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminPagesService: AdminPagesService,
    private messageService: MessageService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listData }) => {
      this.items = listData.list;
    });
    this.subscriptionList$$.add(
      this.translocoService.langChanges$.subscribe((e) => {
        this.pageLabel = `title${e.toUpperCase()}`;
      })
    );

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'performanceTemplate', header: 'Performans Şablon' },
      { field: 'period', header: 'Dönem' },
      { field: 'orderId', header: 'Sıra' },
      { field: 'isRequired', header: 'Zorunlu' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPerformanceTemplatePeriodItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPerformanceTemplatePeriodItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPerformanceTemplatePeriodItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPerformanceTemplatePeriodItem) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    this.loading = true;
    this.deleteItemDialog = false;

    this.subscriptionList$$.add(
      this.adminPagesService
        .deleteItem(this.item.id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((response: boolean | null) => {
          if (response) {
            this.item = this.itemDefaults;
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.', life: 3000 });
            this._getItem(0);
          }
        })
    );
  }

  hideDialog() {
    this.itemDialog = false;
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.item = this.form.getRawValue() as IPerformanceTemplatePeriodItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPerformanceTemplatePeriodItem>>(
              { data: { item: this.item, list: [] } },
              this._path
            )
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe((response: boolean | null) => {
              if (response) {
                this.hideDialog();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Başarılı',
                  detail: 'Kaydedildi.',
                  life: 3000
                });
                this._getItem(0);
              }
            })
        : this.adminPagesService
            .createItem<AdminDataGeneric<IPerformanceTemplatePeriodItem>>(
              { data: { item: this.item, list: [] } },
              this._path
            )
            .pipe(
              finalize(() => {
                this.loading = false;
              })
            )
            .subscribe((response: boolean | null) => {
              if (response) {
                this.hideDialog();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Başarılı',
                  detail: 'Kaydedildi.',
                  life: 3000
                });
                this._getItem(0);
              }
            })
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.subscriptionList$$.unsubscribe();
  }
}
