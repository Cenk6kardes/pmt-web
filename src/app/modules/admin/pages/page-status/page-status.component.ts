import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPageStatusItem } from '../../models/page-status.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, Subscription } from 'rxjs';

@Component({
  templateUrl: './page-status.component.html',
  styleUrls: ['./page-status.component.scss'],
  providers: [MessageService]
})
export class PageStatusComponent implements OnInit, OnDestroy {
  pageHeader = 'Statü Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageStatusItem[] = [];
  itemDefaults: IPageStatusItem = {
    id: 0,
    titleTR: '',
    titleEN: '',
    titleTRMine: '',
    titleENMine: '',
    titleENYours: '',
    titleTRYours: ''
  };
  item: IPageStatusItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    titleEN: [this.item.titleEN, Validators.required],
    titleENMine: [this.item.titleENMine],
    titleENYours: [this.item.titleENYours],
    titleTR: [this.item.titleTR],
    titleTRMine: [this.item.titleTRMine, Validators.required],
    titleTRYours: [this.item.titleTRYours, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'pagestatus';

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
      { field: 'titleEN', header: 'Statü EN' },
      { field: 'titleENMine', header: 'Giden Statü EN' },
      { field: 'titleENYours', header: 'Gelen Statü EN' },
      { field: 'titleTR', header: 'Statü TR' },
      { field: 'titleTRMine', header: 'Giden Statü TR' },
      { field: 'titleTRYours', header: 'Gelen Statü TR' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPageStatusItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageStatusItem>) =>
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

  editItem(item: IPageStatusItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPageStatusItem) {
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
    this.item = this.form.getRawValue() as IPageStatusItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPageStatusItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IPageStatusItem>>({ data: { item: this.item, list: [] } }, this._path)
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
