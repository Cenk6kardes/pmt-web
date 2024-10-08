import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, Subscription } from 'rxjs';
import { IWidgetItem } from '../../models/widget.model';

@Component({
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  providers: [MessageService]
})
export class WidgetComponent implements OnInit, OnDestroy {
  pageHeader = 'Widget Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IWidgetItem[] = [];
  itemDefaults: IWidgetItem = {
    id: 0,
    title: '',
    widgetType: '',
    query: '',
    cachingTime: 0,
    isRemoved: false
  };
  item: IWidgetItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    title: [this.item.title, Validators.required],
    widgetType: [this.item.widgetType, Validators.required],
    query: [this.item.query, Validators.required],
    cachingTime: [this.item.cachingTime, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'widget';

  private _widgetTypes = [
    { label: 'Dairesel', value: 'PieChart' },
    { label: 'Çubuk', value: 'BarChart' },
    { label: 'Liste', value: 'ListChart' }
  ];

  get widgetTypes() {
    return this._widgetTypes;
  }

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
      { field: 'title', header: 'Widget İsmi' },
      { field: 'widgetType', header: 'Grafik Türü' },
      { field: 'query', header: 'Sorgu' },
      { field: 'cachingTime', header: 'Önbellek Zamanı' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IWidgetItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IWidgetItem>) =>
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

  editItem(item: IWidgetItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IWidgetItem) {
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
    this.item = this.form.getRawValue() as IWidgetItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IWidgetItem>>({ data:{item:this.item,list:[]} }, this._path)
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
            .createItem<AdminDataGeneric<IWidgetItem>>({ data:{item:this.item,list:[]} }, this._path)
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
