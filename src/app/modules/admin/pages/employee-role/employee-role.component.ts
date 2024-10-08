import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IEmployeeRoleItem } from '../../models/employee-role.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { IEmployeeRoleTypeItem } from '../../models/employee-role-type.model';
import { EmptyFieldValue } from '../../models/empty-field-value.model';

@Component({
  templateUrl: './employee-role.component.html',
  styleUrls: ['./employee-role.component.scss'],
  providers: [MessageService]
})
export class EmployeeRoleComponent implements OnInit, OnDestroy {
  pageHeader = 'Sayfa Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IEmployeeRoleItem[] = [];
  itemDefaults: IEmployeeRoleItem = {
    id: '',
    title: '',
    employeeRoleTypeId: null,
    employeeRoleType: '',
    titleTR: '',
    titleEN: ''
  };
  item: IEmployeeRoleItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    employeeRoleTypeId: [this.item.employeeRoleTypeId, Validators.required],
    title: [this.item.title, [Validators.required,Validators.maxLength(50)]],
    titleTR: [this.item.titleTR, [Validators.required,Validators.maxLength(50)]],
    titleEN: [this.item.titleEN, [Validators.required,Validators.maxLength(50)]]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'employeerole';
  pageLabel: string = 'titleTR';

  employeeRoleTypeList$: Observable<IEmployeeRoleTypeItem[]> = this.adminPagesService
  .getList<AdminDataGeneric<IEmployeeRoleTypeItem>>('employeeroletype')
  .pipe(map((response: AdminDataGeneric<IEmployeeRoleTypeItem>) => response.list));

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
      { field: 'employeeRoleType', header: 'Rol Tipi' },
      { field: 'title', header: 'Sistem Adı' },
      { field: 'titleTR', header: 'Başlık TR' },
      { field: 'titleEN', header: 'Başlık EN' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IEmployeeRoleItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IEmployeeRoleItem>) =>
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

  editItem(item: IEmployeeRoleItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IEmployeeRoleItem) {
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
    this.submitted = false;
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.submitted = true;
    this.item = this.form.getRawValue() as IEmployeeRoleItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IEmployeeRoleItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IEmployeeRoleItem>>({ data: { item:{...this.item,id:EmptyFieldValue.UUID}, list: [] } }, this._path)
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
