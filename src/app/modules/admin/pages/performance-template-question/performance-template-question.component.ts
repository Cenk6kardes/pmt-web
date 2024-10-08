import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';
import { IPerformanceTemplateQuestion } from '../../models/performance-template-question.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { EmptyFieldValue } from '../../models/empty-field-value.model';
import { IPerformanceTemplateItem } from '../../models/performance-template.model';
import { IEmployeeRoleItem } from '../../models/employee-role.model';
import { TranslocoService } from '@ngneat/transloco';
import { IQuestionItem } from '../../models/question.model';
import { IQuestionCategory } from '../../models/question-category.model';
import { IQuestionScaleTypeItem } from '../../models/question-scale-type.model';

@Component({
  templateUrl: './performance-template-question.component.html',
  styleUrls: ['./performance-template-question.component.scss'],
  providers: [MessageService]
})
export class PerformanceTemplateQuestionComponent implements OnInit, OnDestroy {
  pageHeader = 'Şablon Soruları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IPerformanceTemplateQuestion[] = [];
  itemDefaults: IPerformanceTemplateQuestion = {
    performanceTemplateId: EmptyFieldValue.STRING,
    performanceTemplate: EmptyFieldValue.STRING,
    employeeRoleId: EmptyFieldValue.STRING,
    employeeRole: EmptyFieldValue.STRING,
    questionId: EmptyFieldValue.STRING,
    question: EmptyFieldValue.STRING,
    questionMainCategoryId: EmptyFieldValue.NULL,
    questionMainCategory: EmptyFieldValue.STRING,
    questionCategoryId: EmptyFieldValue.NULL,
    questionCategory: EmptyFieldValue.STRING,
    questionSubCategoryId: EmptyFieldValue.NULL,
    questionSubCategory: EmptyFieldValue.STRING,
    ratio: EmptyFieldValue.NULL,
    questionScaleTypeId: EmptyFieldValue.NULL,
    questionScaleType: EmptyFieldValue.STRING,
    orderId: EmptyFieldValue.NULL
  };
  item: IPerformanceTemplateQuestion = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];

  performanceCategoryList$: Observable<IPerformanceTemplateItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IPerformanceTemplateItem>>('performanceTemplate')
    .pipe(map((response: AdminDataGeneric<IPerformanceTemplateItem>) => response.list));
  employeeRoleList$: Observable<IEmployeeRoleItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeRoleItem>>('employeerole')
    .pipe(map((response: AdminDataGeneric<IEmployeeRoleItem>) => response.list));
  questionList$: Observable<IQuestionItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IQuestionItem>>('question')
    .pipe(map((response: AdminDataGeneric<IQuestionItem>) => response.list));
  questionCategoryList$: Observable<IQuestionCategory[]> = this.adminPagesService
    .getList<AdminDataGeneric<IQuestionCategory>>('questioncategory')
    .pipe(map((response: AdminDataGeneric<IQuestionCategory>) => response.list));
  questionScaleTypeList$: Observable<IQuestionScaleTypeItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IQuestionScaleTypeItem>>('questionscaletype')
    .pipe(map((response: AdminDataGeneric<IQuestionScaleTypeItem>) => response.list));

  form = this.formBuilder.group({
    performanceTemplateId: [this.item.performanceTemplateId, Validators.required],
    employeeRoleId: [this.item.employeeRoleId, Validators.required],
    questionId: [this.item.questionId, Validators.required],
    questionMainCategoryId: [this.item.questionMainCategoryId, Validators.required],
    questionCategoryId: [this.item.questionCategoryId, Validators.required],
    questionSubCategoryId: [this.item.questionSubCategoryId, Validators.required],
    ratio: [this.item.ratio, [Validators.required, Validators.min(1), Validators.max(100)]],
    questionScaleTypeId: [this.item.questionScaleTypeId, Validators.required],
    orderId: [this.item.orderId, [Validators.required, Validators.min(1), Validators.max(1000)]]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'performancetemplatequestion';
  pageLabel: string = 'titleTR';

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
      { field: 'performanceTemplate', header: 'Şablon' },
      { field: 'employeeRole', header: 'Rol' },
      { field: 'question', header: 'Soru' },
      { field: 'questionMainCategory', header: 'Ana Kategori' },
      { field: 'questionCategory', header: 'Kategori' },
      { field: 'questionSubCategory', header: 'Alt Kategori' },
      { field: 'ratio', header: 'Oran' },
      { field: 'questionScaleType', header: 'Cevap Şablonu' },
      { field: 'orderId', header: 'Soru Sırası' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IPerformanceTemplateQuestion>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IPerformanceTemplateQuestion>) =>
          id ? this.form.reset(data.item!) : (this.items = data.list)
        )
    );
  }

  openNew() {
    this.form.get('employeeRoleId')?.enable();
    this.form.get('performanceTemplateId')?.enable();
    this.form.get('questionId')?.enable();
    this.form.updateValueAndValidity();

    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item: IPerformanceTemplateQuestion) {
    this.form.get('employeeRoleId')?.disable();
    this.form.get('performanceTemplateId')?.disable();
    this.form.get('questionId')?.disable();
    this.form.updateValueAndValidity();

    this._getItem(`id1=${item.employeeRoleId}&id2=${item.performanceTemplateId}&id3=${item.questionId}`);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IPerformanceTemplateQuestion) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    this.loading = true;
    this.deleteItemDialog = false;

    this.subscriptionList$$.add(
      this.adminPagesService
        .deleteItem(
          `id1=${this.item.performanceTemplateId}&id2=${this.item.employeeRoleId}&id3=${this.item.questionId}`,
          this._path
        )
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
    this.item = this.form.getRawValue() as IPerformanceTemplateQuestion;

    this.subscriptionList$$.add(
      this.form.get('employeeRoleId')?.disabled
        ? this.adminPagesService
            .editItem<AdminDataGeneric<IPerformanceTemplateQuestion>>(
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
            .createItem<AdminDataGeneric<IPerformanceTemplateQuestion>>(
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
