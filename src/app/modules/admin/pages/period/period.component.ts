import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPeriodItem } from '../../models/period.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { IPageDetailItem } from '../../models/page-detail.model';

@Component({
  templateUrl: './period.component.html',
  styleUrls: ['./period.component.scss'],
  providers: [MessageService]
})
export class PeriodComponent implements OnInit, OnDestroy {
  pageHeader = 'Süreç Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPeriodItem[] = [];
  itemDefaults: IPeriodItem = {
    id: 0,
    title: '',
    titleTR: '',
    titleEN: '',
    pageId: null,
    page: ''
  };
  item: IPeriodItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    title: [this.item.title, [Validators.required, Validators.maxLength(150)]],
    titleTR: [this.item.titleTR, [Validators.required, Validators.maxLength(150)]],
    titleEN: [this.item.titleEN, [Validators.required, Validators.maxLength(150)]],
    pageId: [this.item.pageId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'period';
  pageLabel: string = 'titleTR';

  pageList$: Observable<IPageDetailItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageDetailItem>>('page')
    .pipe(map((response: AdminDataGeneric<IPageDetailItem>) => response.list));

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
      { field: 'title', header: 'Teknik Başlık' },
      { field: 'titleTR', header: 'Başlık TR' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'page', header: 'Sayfa' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPeriodItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPeriodItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPeriodItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPeriodItem) {
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
    this.item = this.form.getRawValue() as IPeriodItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPeriodItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IPeriodItem>>({ data: { item: this.item, list: [] } }, this._path)
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
