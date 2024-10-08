import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPagePeriodStatusItem } from '../../models/page-period-status.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';
import { TranslocoService } from '@ngneat/transloco';
import { IPageStatusItem } from '../../models/page-status.model';
import { IPeriodItem } from '../../models/period.model';
import { IPageStatusDirection } from '../../models/page-status-direction.model';

@Component({
  templateUrl: './page-period-status.component.html',
  styleUrls: ['./page-period-status.component.scss'],
  providers: [MessageService]
})
export class PagePeriodStatusComponent implements OnInit, OnDestroy {
  pageHeader = 'Süreç Statü Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPagePeriodStatusItem[] = [];
  itemDefaults: IPagePeriodStatusItem = {
    id: '',
    pageStatusId: null,
    pageStatus: '',
    periodId: null,
    period: '',
    pageStatusDirectionId: null,
    pageStatusDirection: ''
  };
  item: IPagePeriodStatusItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    pageStatusId: [this.item.pageStatusId, Validators.required],
    periodId: [this.item.periodId, Validators.required],
    pageStatusDirectionId: [this.item.pageStatusDirectionId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pageperiodstatus';
  pageLabel: string = 'titleTR';

  pageStatusList$: Observable<IPageStatusItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageStatusItem>>('pagestatus')
    .pipe(map((response: AdminDataGeneric<IPageStatusItem>) => response.list));
  periodList$: Observable<IPeriodItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPeriodItem>>('period')
    .pipe(map((response: AdminDataGeneric<IPeriodItem>) => response.list));
  pageStatusDirectionList$: Observable<IPageStatusDirection[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageStatusDirection>>('pagestatusdirection')
    .pipe(map((response: AdminDataGeneric<IPageStatusDirection>) => response.list));

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
      { field: 'pageStatus', header: 'Sayfa Durum' },
      { field: 'period', header: 'Dönem' },
      { field: 'pageStatusDirection', header: 'Süreç Statü Yön' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPagePeriodStatusItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPagePeriodStatusItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPagePeriodStatusItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPagePeriodStatusItem) {
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
            this._getItem('');
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
    this.item = this.form.getRawValue() as IPagePeriodStatusItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPagePeriodStatusItem>>({ data: { item: this.item, list: [] } }, this._path)
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
                this._getItem('');
              }
            })
        : this.adminPagesService
            .createItem<AdminDataGeneric<IPagePeriodStatusItem>>({ data: { item: this.item, list: [] } }, this._path)
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
                this._getItem('');
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
