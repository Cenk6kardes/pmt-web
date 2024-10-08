import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IPageAuthorizationItem } from '../../models/page-authorization.model';
import { IPageDetailItem } from '../../models/page-detail.model';
import { IPagePeriodStatusItem } from '../../models/page-period-status.model';
import { IPagePerformanceCategoryItem } from '../../models/page-performance-category.model';
import { IEmployeeRoleItem } from '../../models/employee-role.model';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  templateUrl: './page-authorization.component.html',
  styleUrls: ['./page-authorization.component.scss'],
  providers: [MessageService]
})
export class PageAuthorizationComponent implements OnInit, OnDestroy {
  pageHeader = 'Sayfa Yetki Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageAuthorizationItem[] = [];
  itemDefaults: IPageAuthorizationItem = {
    id: 0,
    pageId: null,
    page: null,
    employeeRoleId: '',
    employeeRole: null,
    pagePeriodStatusId: '',
    pagePeriodStatus: null,
    performanceCategoryId: null,
    performanceCategory: null,
    hasView: false,
    hasInsert: false,
    hasEdit: false,
    hasDelete: false,
    createdDate: null,
    createdBy: null,
    lastModifiedDate: null,
    lastModifiedBy: null,
    isRemoved: false
  };
  item: IPageAuthorizationItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    pageId: [this.item.pageId, Validators.required],
    employeeRoleId: [this.item.employeeRoleId, Validators.required],
    pagePeriodStatusId: [this.item.pagePeriodStatusId, Validators.required],
    performanceCategoryId: [this.item.performanceCategoryId],
    hasView: [this.item.hasView, Validators.required],
    hasInsert: [this.item.hasInsert, Validators.required],
    hasEdit: [this.item.hasEdit, Validators.required],
    hasDelete: [this.item.hasDelete, Validators.required],
    createdDate: [this.item.createdDate],
    createdBy: [this.item.createdBy],
    lastModifiedDate: [this.item.lastModifiedDate],
    lastModifiedBy: [this.item.lastModifiedBy],
    isRemoved: [this.item.isRemoved]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pageauthorization';
  pageLabel: string = 'titleTR';

  pageList$: Observable<IPageDetailItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageDetailItem>>('page')
    .pipe(map((response: AdminDataGeneric<IPageDetailItem>) => response.list));
  pagePeriodStatusList$: Observable<IPagePeriodStatusItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPagePeriodStatusItem>>('PagePeriodStatus')
    .pipe(map((response: AdminDataGeneric<IPagePeriodStatusItem>) => response.list));
  performanceCategoryList$: Observable<IPagePerformanceCategoryItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPagePerformanceCategoryItem>>('performancecategory')
    .pipe(map((response: AdminDataGeneric<IPagePerformanceCategoryItem>) => response.list));
  employeeRoleList$: Observable<IEmployeeRoleItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeRoleItem>>('employeerole')
    .pipe(map((response: AdminDataGeneric<IEmployeeRoleItem>) => response.list));

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
      { field: 'page', header: 'Sayfa' },
      { field: 'employeeRole', header: 'Rol' },
      { field: 'pagePeriodStatus', header: 'Sayfa Periyot Durumu' },
      { field: 'performanceCategory', header: 'Performans Kategori' },
      { field: 'hasView', header: 'Listeleme' },
      { field: 'hasInsert', header: 'Oluşturma' },
      { field: 'hasEdit', header: 'Güncelleme' },
      { field: 'hasDelete', header: 'Silme' }
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
        .getItem<AdminDataGeneric<IPageAuthorizationItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageAuthorizationItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item: IPageAuthorizationItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPageAuthorizationItem) {
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
    this.submitted = false;
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.submitted = true;
    this.item = this.form.getRawValue() as IPageAuthorizationItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPageAuthorizationItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IPageAuthorizationItem>>({ data: { item: this.item, list: [] } }, this._path)
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
