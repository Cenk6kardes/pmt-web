import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IPerformanceTemplateItem } from '../../models/performance-template.model';
import { EmptyFieldValue } from '../../models/empty-field-value.model';

@Component({
  templateUrl: './performance-template.component.html',
  styleUrls: ['./performance-template.component.scss'],
  providers: [MessageService]
})
export class PerformanceTemplateComponent implements OnInit, OnDestroy {
  pageHeader = 'Şablon Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPerformanceTemplateItem[] = [];
  itemDefaults: IPerformanceTemplateItem = {
    id: '',
    title: '',
    description: '',
    performanceCategory: '',
    performanceCategoryId: null,
    defaultRatio: null
  };
  item: IPerformanceTemplateItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    description: [this.item.description, [Validators.required, Validators.maxLength(500)]],
    title: [this.item.title, [Validators.required, Validators.maxLength(150)]],
    performanceCategoryId: [this.item.performanceCategoryId, Validators.required],
    defaultRatio: [this.item.defaultRatio, [Validators.required, Validators.min(1), Validators.max(100)]]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'performancetemplate';

  performanceCategoryList$: Observable<IPerformanceTemplateItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPerformanceTemplateItem>>('performancecategory')
    .pipe(map((response: AdminDataGeneric<IPerformanceTemplateItem>) => response.list));

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
      { field: 'title', header: 'Şablon Adı' },
      { field: 'description', header: 'Detay Açıklaması' },
      { field: 'performanceCategory', header: 'Performans Kategorisi' },
      { field: 'defaultRatio', header: 'Varsayılan Katkı Oranı' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPerformanceTemplateItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPerformanceTemplateItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPerformanceTemplateItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPerformanceTemplateItem) {
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
            this._getItem(EmptyFieldValue.STRING);
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
    this.item = this.form.getRawValue() as IPerformanceTemplateItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPerformanceTemplateItem>>({ data: { item: this.item, list: [] } }, this._path)
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
                this._getItem(EmptyFieldValue.STRING);
              }
            })
        : this.adminPagesService
            .createItem<AdminDataGeneric<IPerformanceTemplateItem>>(
              { data: { item: { ...this.item, id: EmptyFieldValue.UUID }, list: [] } },
              this._path
            )
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
                this._getItem(EmptyFieldValue.STRING);
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
