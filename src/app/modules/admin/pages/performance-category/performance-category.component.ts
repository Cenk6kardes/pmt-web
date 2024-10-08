import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';
import { IPerformanceCategoryItem } from '../../models/performance-category.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IPageDetailItem } from '../../models/page-detail.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  templateUrl: './performance-category.component.html',
  styleUrls: ['./performance-category.component.scss'],
  providers: [MessageService]
})
export class PerformanceCategoryComponent implements OnInit, OnDestroy {
  pageHeader = 'Performans Kategori Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPerformanceCategoryItem[] = [];
  itemDefaults: IPerformanceCategoryItem = {
    id: 0,
    title: '',
    titleEN: '',
    pageId: null,
    page: '',
    description: ''
  };
  item: IPerformanceCategoryItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    title: [this.item.title, Validators.required],
    titleEN: [this.item.titleEN, Validators.required],
    pageId: [this.item.pageId, Validators.required],
    description: [this.item.description, Validators.maxLength(300)]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'performancecategory';
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

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'title', header: 'Başlık' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'page', header: 'Sayfa' },
      { field: 'description', header: 'Detay Açıklaması' }
    ];

    this.subscriptionList$$.add(
      this.translocoService.langChanges$.subscribe((e) => {
        this.pageLabel = `title${e.toUpperCase()}`;
      })
    );
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPerformanceCategoryItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPerformanceCategoryItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPerformanceCategoryItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPerformanceCategoryItem) {
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
    this.item = this.form.getRawValue() as IPerformanceCategoryItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPerformanceCategoryItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IPerformanceCategoryItem>>({ data: { item: this.item, list: [] } }, this._path)
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
