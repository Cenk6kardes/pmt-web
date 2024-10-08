import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';

import { IPageAuthorizationStatusItem } from '../../models/page-auth-status.model';
import { IPagePeriodStatusItem } from '../../models/page-period-status.model';
import { IPageStatusScopeItem } from '../../models/page-status-scope.model';

@Component({
  templateUrl: './page-auth-status.component.html',
  styleUrls: ['./page-auth-status.component.scss'],
  providers: [MessageService]
})
export class PageAuthStatusComponent implements OnInit, OnDestroy {
  pageHeader = 'Sayfa Statü Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageAuthorizationStatusItem[] = [];
  itemDefaults: IPageAuthorizationStatusItem = {
    pageAuthorizationId: 0,
    pagePeriodStatusId: null,
    pagePeriodStatus: '',
    pageStatusScopeId: null,
    pageStatusScope: ''
  };
  item: IPageAuthorizationStatusItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    pageAuthorizationId: [this.item.pageAuthorizationId],
    pagePeriodStatusId: [this.item.pagePeriodStatusId, Validators.required],
    pageStatusScopeId: [this.item.pageStatusScopeId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pageauthorizationstatus';

  pagePeriodStatusList$: Observable<IPagePeriodStatusItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPagePeriodStatusItem>>('pageperiodstatus')
    .pipe(map((response: AdminDataGeneric<IPagePeriodStatusItem>) => response.list));
  pageStatusScopeIdList$: Observable<IPageStatusScopeItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageStatusScopeItem>>('pagestatusscope')
    .pipe(map((response: AdminDataGeneric<IPageStatusScopeItem>) => response.list));
  pageAuthorizationIdList$: Observable<IPageAuthorizationStatusItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageAuthorizationStatusItem>>('pageauthorization')
    .pipe(map((response: AdminDataGeneric<IPageAuthorizationStatusItem>) => response.list));

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminPagesService: AdminPagesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listData }) => {
      this.items = listData.list;
    });

    this.cols = [
      { field: 'pageAuthorizationId', header: 'Sayfa Yetki ID' },
      { field: 'pagePeriodStatus', header: 'Sayfa Dönem Durumu' },
      { field: 'pageStatusScope', header: 'Sayfa Durum Kapsamı' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPageAuthorizationStatusItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageAuthorizationStatusItem>) => {
          id ? this.form.reset(data.item!) : (this.items = data.list);
        })
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.submitted = false;
    this.itemDialog = true;
  }

  deleteItem(item: IPageAuthorizationStatusItem) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    this.loading = true;
    this.deleteItemDialog = false;

    this.subscriptionList$$.add(
      this.adminPagesService
        .deleteItem(`id1=${this.item.pageAuthorizationId}&id2=${this.item.pagePeriodStatusId}&id3=${this.item.pageStatusScopeId}`,
          this._path)
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
    this.submitted = false;
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.submitted = true;
    this.item = this.form.getRawValue() as IPageAuthorizationStatusItem;

    this.subscriptionList$$.add(
      this.adminPagesService
        .createItem<AdminDataGeneric<IPageAuthorizationStatusItem>>({ data: { item: this.item, list: [] } }, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((response: boolean | null) => {
          if (response) {
            this.hideDialog();
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kaydedildi.', life: 3000 });
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
