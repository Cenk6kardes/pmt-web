import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPageMenuItem } from '../../models/page-menu-item.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';
import { IPageDetailItem } from '../../models/page-detail.model';
import { TranslocoService } from '@ngneat/transloco';
import { primeIcons } from 'src/assets/primeIcons/primeIcons';

@Component({
  templateUrl: './page-menu-item.component.html',
  styleUrls: ['./page-menu-item.component.scss'],
  providers: [MessageService]
})
export class PageMenuItemComponent implements OnInit, OnDestroy {
  pageHeader = 'Menü Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageMenuItem[] = [];
  itemDefaults: IPageMenuItem = {
    id: EmptyFieldValue.NUMBER,
    pageId: EmptyFieldValue.NULL,
    page: EmptyFieldValue.STRING,
    title: EmptyFieldValue.STRING,
    titleTR: EmptyFieldValue.STRING,
    titleEN: EmptyFieldValue.STRING,
    icon: EmptyFieldValue.STRING,
    parentId: EmptyFieldValue.NULL,
    parent: EmptyFieldValue.STRING,
    orderId: EmptyFieldValue.NULL
  };
  item: IPageMenuItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    pageId: [this.item.pageId, Validators.required],
    title: [this.item.title, Validators.required],
    titleTR: [this.item.titleTR, Validators.required],
    titleEN: [this.item.titleEN, Validators.required],
    icon: [this.item.icon],
    parentId: [this.item.parentId],
    orderId: [this.item.orderId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pagemenuitem';
  pageLabel: string = 'titleTR';

  iconList = primeIcons;

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
    this.form.get('parentId')?.disable();
    this.form.get('pageId')?.valueChanges.subscribe((pageId) => {
      if (pageId) {
        this.form.get('parentId')?.enable();
      } else {
        this.form.get('parentId')?.setValue(null);
        this.form.get('parentId')?.disable();
      }
    });
    this.form.get('parentId')?.updateValueAndValidity();

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'page', header: 'Sayfa' },
      { field: 'title', header: 'Teknik Başlık' },
      { field: 'titleTR', header: 'Başlık TR' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'icon', header: 'Menü İkonu' },
      { field: 'parent', header: 'Bağlı Sayfa' },
      { field: 'orderId', header: 'Menü Sırası' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPageMenuItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageMenuItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  checkParentOnChange(parentId: number): void {
    const currentPage = this.items.find((page) => page.id === parentId);

    if (currentPage && currentPage?.parentId !== null) {
      if (currentPage?.pageId === this.form.get('pageId')?.value) {
        this.form.get('parentId')?.setValue(null);
        this.form.get('parentId')?.updateValueAndValidity();
        this.messageService.add({
          severity: 'warn',
          summary: 'Uyarı',
          detail: 'Seçtiğiniz sayfa zaten bu sayfaya bağlıdır.',
          life: 3000
        });
      } else {
        this.checkParentOnChange(currentPage.parentId);
      }
    }
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPageMenuItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPageMenuItem) {
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
    this.item = this.form.getRawValue() as IPageMenuItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPageMenuItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IPageMenuItem>>({ data: { item: this.item, list: [] } }, this._path)
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
