import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IQuestionItem } from '../../models/question.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';
import { IQuestionTypeItem } from '../../models/question-type.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';

@Component({
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  providers: [MessageService]
})
export class QuestionComponent implements OnInit, OnDestroy {
  pageHeader = 'Soru Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IQuestionItem[] = [];
  itemDefaults: IQuestionItem = {
    id: '',
    title: '',
    titleEN: '',
    note: '',
    description: '',
    questionTypeId: null,
    questionType: '',
    isRemoved: false
  };
  item: IQuestionItem = this.itemDefaults;
  cols: { field: string; header: string }[] = [];

  questionTypeList$: Observable<IQuestionTypeItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IQuestionTypeItem>>('questiontype')
    .pipe(map((response: AdminDataGeneric<IQuestionTypeItem>) => response.list));

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, Validators.required],
    title: [this.item.title, Validators.required],
    titleEN: [this.item.titleEN, Validators.required],
    note: [this.item.note, Validators.maxLength(300)],
    description: [this.item.description, Validators.maxLength(300)],
    questionTypeId: [this.item.questionTypeId, Validators.required]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'question';

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
      { field: 'title', header: 'Başlık' },
      { field: 'titleEN', header: 'Başlık EN' },
      { field: 'note', header: 'Not' },
      { field: 'description', header: 'Açıklama' },
      { field: 'questionType', header: 'Soru Türü' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IQuestionItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IQuestionItem>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.itemDialog = true;
  }

  editItem(item: IQuestionItem) {
    if (item.id) {
      this._getItem(item.id);
      this.item = { ...item };
      this.itemDialog = true;
    }
  }

  deleteItem(item: IQuestionItem) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    if (this.item.id) {
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
  }

  hideDialog() {
    this.itemDialog = false;
    this.form.reset(this.itemDefaults);
  }

  saveItem() {
    this.loading = true;
    this.item = this.form.getRawValue() as IQuestionItem;

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IQuestionItem>>({ data: { item: this.item, list: [] } }, this._path)
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
            .createItem<AdminDataGeneric<IQuestionItem>>(
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
