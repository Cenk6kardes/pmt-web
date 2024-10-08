import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IWidgetPermissionItem } from '../../models/widget-permission.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IWidgetItem } from '../../models/widget.model';
import { IEmployeeRoleItem } from '../../models/employee-role.model';

@Component({
  templateUrl: './widget-permission.component.html',
  styleUrls: ['./widget-permission.component.scss'],
  providers: [MessageService]
})
export class WidgetPermissionComponent implements OnInit, OnDestroy {
  pageHeader = 'Widget Yetki Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IWidgetPermissionItem[] = [];
  itemDefaults: IWidgetPermissionItem = {
    id: 0,
    widgetId: null,
    widget: null,
    employeeRoleId: null,
    employeeRole: null
  };
  item: IWidgetPermissionItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    widgetId: [this.item.widgetId, Validators.required],
    employeeRoleId: [this.item.widget, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'widgetpermission';

  widgetList$: Observable<IWidgetItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IWidgetItem>>('widget')
    .pipe(map((response: AdminDataGeneric<IWidgetItem>) => response.list.filter((widget) => !widget.isRemoved)));
  employeeRoleList$: Observable<IEmployeeRoleItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeRoleItem>>('employeerole')
    .pipe(map((response: AdminDataGeneric<IEmployeeRoleItem>) => response.list));
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private adminPagesService: AdminPagesService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listData }) => {
      this.items = listData.list;
    });

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'widget', header: 'Widget' },
      { field: 'employeeRole', header: 'Rol' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IWidgetPermissionItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IWidgetPermissionItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IWidgetPermissionItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IWidgetPermissionItem) {
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
    this.item = this.form.getRawValue() as IWidgetPermissionItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IWidgetPermissionItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IWidgetPermissionItem>>({ data: { item: this.item, list: [] } }, this._path)
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
