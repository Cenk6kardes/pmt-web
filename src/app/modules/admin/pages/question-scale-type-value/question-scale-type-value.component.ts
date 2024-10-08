import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IQuestionScaleTypeValueItem } from '../../models/question-scale-type-value.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';
import { IQuestionScaleTypeItem } from '../../models/question-scale-type.model';

@Component({
  templateUrl: './question-scale-type-value.component.html',
  styleUrls: ['./question-scale-type-value.component.scss'],
  providers: [MessageService]
})
export class QuestionScaleTypeValueComponent implements OnInit, OnDestroy {
  pageHeader = 'Cevap Değer Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IQuestionScaleTypeValueItem[] = [];
  itemDefaults: IQuestionScaleTypeValueItem = {
    id: EmptyFieldValue.UUID,
    questionScaleTypeId: EmptyFieldValue.NULL,
    questionScaleType: EmptyFieldValue.STRING,
    title: EmptyFieldValue.STRING,
    titleEN: EmptyFieldValue.STRING,
    numericValue: EmptyFieldValue.NUMBER,
    orderId: EmptyFieldValue.NUMBER
  };
  item: IQuestionScaleTypeValueItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];
  emptyFieldValue = EmptyFieldValue;

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required, Validators.min(0)]],
    questionScaleTypeId: [this.item.questionScaleTypeId, Validators.required],
    title: [this.item.title, [Validators.required, Validators.maxLength(150)]],
    titleEN: [this.item.titleEN, [Validators.required, Validators.maxLength(150)]],
    numericValue: [this.item.numericValue, Validators.required],
    orderId: [this.item.orderId, [Validators.required, Validators.max(256)]]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'questionscaletypevalue';

  questionScaleTypeList$: Observable<IQuestionScaleTypeItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IQuestionScaleTypeItem>>('questionscaletype')
    .pipe(map((response: AdminDataGeneric<IQuestionScaleTypeItem>) => response.list));

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
      { field: 'questionScaleType', header: 'Soru Ölçeği Türü' },
      { field: 'title', header: 'Teknik Başlık' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'numericValue', header: 'Sayısal Karşılık' },
      { field: 'orderId', header: 'Menü Sırası' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IQuestionScaleTypeValueItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IQuestionScaleTypeValueItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IQuestionScaleTypeValueItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IQuestionScaleTypeValueItem) {
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
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.item = this.form.getRawValue() as IQuestionScaleTypeValueItem;

    this.subscriptionList$$.add(
      this.item.id !== EmptyFieldValue.UUID
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IQuestionScaleTypeValueItem>>(
              { data: { item: this.item, list: [] } },
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
                this._getItem('');
              }
            })
        : this.adminPagesService
            .createItem<AdminDataGeneric<IQuestionScaleTypeValueItem>>(
              { data: { item: this.item, list: [] } },
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
