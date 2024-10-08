import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPageMenuPermission } from '../../models/page-menu-permission.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';
import { TranslocoService } from '@ngneat/transloco';
import { IEmployeeRoleItem } from '../../models/employee-role.model';
import { IPageMenuItem } from '../../models/page-menu-item.model';

@Component({
  templateUrl: './page-menu-permission.component.html',
  styleUrls: ['./page-menu-permission.component.scss'],
  providers: [MessageService]
})
export class PageMenuPermissionComponent implements OnInit, OnDestroy {
  pageHeader = 'Menü Yetki Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageMenuPermission[] = [];
  itemDefaults: IPageMenuPermission = {
    employeeRoleId: EmptyFieldValue.STRING,
    employeeRole: EmptyFieldValue.STRING,
    pageMenuItemId: EmptyFieldValue.NULL,
    pageMenuItem: EmptyFieldValue.STRING
  };
  item: IPageMenuPermission = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    employeeRoleId: [this.item.employeeRoleId, Validators.required],
    pageMenuItemId: [this.item.pageMenuItemId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pagemenupermission';
  pageLabel: string = 'titleTR';

  employeeRoleList$: Observable<IEmployeeRoleItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeRoleItem>>('employeerole')
    .pipe(map((response: AdminDataGeneric<IEmployeeRoleItem>) => response.list));
  pageMenuList$: Observable<IPageMenuItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPageMenuItem>>('pagemenuitem')
    .pipe(map((response: AdminDataGeneric<IPageMenuItem>) => response.list));

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
      { field: 'employeeRole', header: 'Rol' },
      { field: 'pageMenuItem', header: 'Menü' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPageMenuPermission>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageMenuPermission>) =>
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

  deleteItem(item: IPageMenuPermission) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    this.loading = true;
    this.deleteItemDialog = false;

    this.subscriptionList$$.add(
      this.adminPagesService
        .deleteItem(`id1=${this.item.employeeRoleId}&id2=${this.item.pageMenuItemId}`, this._path)
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
    this.item = this.form.getRawValue() as IPageMenuPermission;

    this.subscriptionList$$.add(
      this.adminPagesService
        .createItem<AdminDataGeneric<IPageMenuPermission>>({ data: { item: this.item, list: [] } }, this._path)
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
