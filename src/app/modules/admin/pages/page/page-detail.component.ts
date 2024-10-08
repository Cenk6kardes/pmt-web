import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPageDetailItem } from '../../models/page-detail.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, Subscription } from 'rxjs';

@Component({
  templateUrl: './page-detail.component.html',
  styleUrls: ['./page-detail.component.scss'],
  providers: [MessageService]
})
export class PageDetailComponent implements OnInit, OnDestroy {
  pageHeader = 'Sayfa Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPageDetailItem[] = [];
  itemDefaults: IPageDetailItem = {
    id: 0,
    route: '',
    title: '',
    titleTR: '',
    titleEN: '',
    descriptionTR: null,
    descriptionEN: null
  };
  item: IPageDetailItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    route: [this.item.route, Validators.required],
    title: [this.item.title, Validators.required],
    titleTR: [this.item.titleTR, Validators.required],
    titleEN: [this.item.titleEN, Validators.required],
    descriptionTR: [this.item.descriptionTR, Validators.maxLength(300)],
    descriptionEN: [this.item.descriptionEN, Validators.maxLength(300)]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'page';

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
      { field: 'route', header: 'Yol' },
      { field: 'title', header: 'Sistem Adı' },
      { field: 'titleTR', header: 'Başlık TR' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'descriptionTR', header: 'Tanım TR' },
      { field: 'descriptionEN', header: 'Tanım EN' }
    ];
  }

  private _getItem(id: number): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPageDetailItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPageDetailItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IPageDetailItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPageDetailItem) {
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
    this.item = this.form.getRawValue() as IPageDetailItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<IPageDetailItem>({ data: this.item }, this._path)
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
            .createItem<IPageDetailItem>({ data: this.item }, this._path)
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
