import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  Type,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, finalize } from "rxjs";
import { AlertService } from 'src/app/core/services/alert.service';
import { GoalsService } from './services/goals.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit, OnDestroy {
  isNaN = isNaN;
  statusList = [];
  columnDefs: any[] = [];
  loading = true;
  steps: any[] = [];
  stepperActiveIndex = 0;

  goalForm!: FormGroup;
  selectedRecords: any = [];
  editDialogVisible = false;
  deleteDialogVisible = false;

  pageProcessId!: number;
  goalStatusForm: any = {
    pagePeriodStatusId: '',
    data: {
      performanceEvaluationDetails: {
        performanceSubject: '',
        performancePeriod: '',
        title: '',
        startDate: '',
        endDate: '',
      },
      questionList: [],
    },
  };
  selectedColumns!: any[];
  totalRatio = 100;
  isAllRatiosAreSet = true;
  activeRowIndex = -1;

  statusComment = '';

  performanceDefaultValues: any = {};
  performanceSubject = '';

  static OperationsComponent: any[] | Type<any>;
  private subscriptionList: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private goalsService: GoalsService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {
    this.isRowSelectable = this.isRowSelectable.bind(this);
  }

  ngOnInit() {
    this.columnDefs = [
      { field: 'questionTypeTitle', header: 'Tipi' },
      { field: 'mainCategoryTitle', header: 'Ana Kategori' },
      { field: 'categoryTitle', header: 'Kategori' },
      { field: 'subCategoryTitle', header: 'Alt kategori' },
      { field: 'ratio', header: 'Oran' },
      { field: 'title', header: '' },
    ];

    this.selectedColumns = this.columnDefs;
    this.subscriptionList.add(
      this.route.paramMap.subscribe((params: any) => {
        this.pageProcessId = params.get('id');
        this.getGoals();
      })
    );
  }

  getGoals(): void {
    this.subscriptionList.add(
      this.goalsService
        .getGoalById(this.pageProcessId)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.goalStatusForm = res;

            if (res?.data?.performanceEvaluationDetails) {
              this.statusComment=res.data.performanceEvaluationDetails.statusComment;
              this.goalStatusForm = {
                ...this.goalStatusForm,
                data: {
                  ...this.goalStatusForm.data,
                  performanceEvaluationDetails: {
                    performanceSubject:
                      res.data.performanceEvaluationDetails
                        .performanceSubject || '',
                    performancePeriod:
                      res.data.performanceEvaluationDetails.performancePeriod ||
                      '',
                    title: res.data.performanceEvaluationDetails.title || '',
                    startDate:
                      new Date(
                        res.data.performanceEvaluationDetails.startDate
                      ) || undefined,
                    endDate:
                      new Date(res.data.performanceEvaluationDetails.endDate) ||
                      undefined,
                  },
                },
              };

              const dataPerformancePeriods = this.goalStatusForm.data.performancePeriods.sort((a: any, b: any) => {
                a.orderId - b.orderId
              }).map((step: any) => {
                return { label: step.title, routerLink: '', startDate: new Date(step.startDate), endDate: new Date(step.endDate) }
              });
              this.steps=[
                {
                    label: 'Başlangıç',
                    routerLink: '',
                    startDate:'',
                    endDate:''
                },
                {
                    label: 'Bitiş',
                    routerLink: '',        
                    startDate:'',
                    endDate:''
                }];
              this.steps[0].startDate = this.goalStatusForm.data.performanceEvaluationDetails.startDate;
              this.steps[1].startDate = this.goalStatusForm.data.performanceEvaluationDetails.endDate; // Used startDate prop for aligning dates to top
              this.steps.splice(1, 0, ...dataPerformancePeriods);
              this.steps = [...this.steps];
              this.stepperActiveIndex = this.steps.findIndex((step: any) => step.label === this.goalStatusForm.data.performanceEvaluationDetails
              .performancePeriod)
            } else {
              this.statusComment = '';
              this.goalStatusForm = {
                ...this.goalStatusForm,
                pagePeriodStatusId: '',
                data: {
                  ...this.goalStatusForm.data,
                  performanceEvaluationDetails: {
                    performanceSubject: '',
                    performancePeriod: '',
                    title: '',
                    startDate: '',
                    endDate: '',
                  },
                },
              };
            }

            this.statusList = res.selectionStatuses.map(
              (status: { id: string; title: string }) => ({
                label: status.title,
                value: status.id,
              })
            );
            this.goalStatusForm.pagePeriodStatusId = res?.status?.id;

            this.performanceDefaultValues = {
              questionTypeTitle: res?.data?.selectionPerformanceQuestionType
                ?.length
                ? res.data.selectionPerformanceQuestionType[0].title
                : '',
              questionTypeId: res?.data?.selectionPerformanceQuestionType
                ?.length
                ? res.data.selectionPerformanceQuestionType[0].id
                : '',
              mainCategoryTitle: res?.data?.selectionMainCategory?.length
                ? res.data.selectionMainCategory[0].title
                : '',
              mainCategoryId: res?.data?.selectionMainCategory?.length
                ? res.data.selectionMainCategory[0].id
                : '',
              categoryTitle: res?.data?.selectionCategory?.length
                ? res.data.selectionCategory[0].title
                : '',
              categoryId: res?.data?.selectionCategory?.length
                ? res.data.selectionCategory[0].id
                : '',
              subCategoryTitle: res?.data?.selectionSubCategory?.length
                ? res.data.selectionSubCategory[0].title
                : '',
              subCategoryId: res?.data?.selectionSubCategory?.length
                ? res.data.selectionSubCategory[0].id
                : '',
              performanceCategoryId:
                res?.data?.questionList[0].performanceCategoryId,
            };
            if (this.goalStatusForm.data.performanceEvaluationDetails.performanceSubject) {
              this.performanceSubject = this.goalStatusForm.data.performanceEvaluationDetails.performanceSubject;
            }
            this._validateRatios();
          },
          error: (error) => {
            this.alertService.callMessage(
              'error',
              'İşlem Başarısız',
              'Liste verileri yüklenemedi'
            );
          },
        })
    );
  }

  get editDialogHeader(){
    return `${this.performanceSubject} Güncelle`;
  };

  get deleteDialogHeader(){
    return `${this.performanceSubject} Sil`;
  };

  get globalFilterFields() {
    return this.columnDefs.map((column) => column['field']);
  }

  onPage() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  warnAboutIsNotSelectable(questionTypeId: number) {
    questionTypeId === 1
      ? this.alertService.callMessage(
          'warn',
          'Seçim Başarısız',
          'Sistem soruları silinemez!..'
        )
      : '';
  }

  isRowSelectable(event: any) {
    return event.data.questionTypeId !== 1;
  }

  addNewGoal() {
    this.goalStatusForm.data.questionList = [
      {
        questionTypeTitle: this.performanceDefaultValues.questionTypeTitle,
        questionTypeId: this.performanceDefaultValues.questionTypeId,
        mainCategoryTitle: this.performanceDefaultValues.mainCategoryTitle,
        mainCategoryId: this.performanceDefaultValues.mainCategoryId,
        categoryTitle: this.performanceDefaultValues.categoryTitle,
        categoryId: this.performanceDefaultValues.categoryId,
        subCategoryTitle: this.performanceDefaultValues.subCategoryTitle,
        subCategoryId: this.performanceDefaultValues.subCategoryId,
        performanceCategoryId:
          this.performanceDefaultValues.performanceCategoryId,
        ratio: 0,
        title: '',
        questionId: new Date().toISOString(), // Used for selection functionality
        isNew: true,
      },
      ...this.goalStatusForm.data.questionList,
    ];

    this._validateRatios();
  }

  editGoal(rowData: any, rowIndex: any) {
    this.activeRowIndex = rowIndex;
    const categoryIndex = this.goalStatusForm.data.selectionCategory.findIndex(
      (category: any) => category.title === rowData.categoryTitle
    );

    this.goalForm = this.fb.group({
      questionId: rowData?.isNew ? rowIndex : rowData.questionId,
      ratio: [rowData.ratio ?? null, Validators.required],
      categoryId: [
        {
          value:
            this.goalStatusForm.data.selectionCategory[categoryIndex]?.id ??
            rowData.categoryTitle, // To be used to show im placeholder
          disabled: rowData.questionTypeId === 1,
        },
        Validators.required,
      ],
      title: [
        { value: rowData.title ?? '', disabled: rowData.questionTypeId === 1 },
        Validators.required,
      ],
    });

    this.editDialogVisible = true;
  }

  deleteGoal() {
    this.deleteDialogVisible = true;
  }

  onUpdateGoal() {
    if (!this.goalForm.valid) return;

    this.selectedRecords = [];
    this.editDialogVisible = false;
    const formValue = this.goalForm.getRawValue();
    const categoryIndex = this.goalStatusForm.data.selectionCategory.findIndex(
      (category: any) => category.id === formValue.categoryId
    );

    this.goalStatusForm.data.questionList[this.activeRowIndex] = {
      ...this.goalStatusForm.data.questionList[this.activeRowIndex],
      questionId: formValue.questionId,
      ratio: formValue.ratio,
      categoryId: categoryIndex === -1 ? null : formValue.categoryId,
      categoryTitle:
        this.goalStatusForm.data.selectionCategory[categoryIndex]?.title ??
        formValue.categoryId,
      title: formValue.title,
    };

    this.cdRef.detectChanges();

    this._validateRatios();
    this.goalForm.reset();
  }

  confirmDelete() {
    this.deleteDialogVisible = false;

    const itemIndexListToBeDeleted = this.selectedRecords.map(
      (item: any) => item.questionId
    );
    this.goalStatusForm.data.questionList =
      this.goalStatusForm.data.questionList.filter((item: any) => {
        return !itemIndexListToBeDeleted.includes(item.questionId);
      });
    this.cdRef.detectChanges();

    this.alertService.callMessage(
      'success',
      'İşlem Başarılı',
      `Seçilen ${this.performanceSubject}ler listeden kaldırılmıştır.`
    );
    this._validateRatios();
    this.selectedRecords = [];
  }

  private _validateRatios(): void {
    this.totalRatio = this.goalStatusForm.data.questionList.reduce(
      (sum: number, item: any) => {
        return sum + item.ratio;
      },
      0
    );

    this.isAllRatiosAreSet =
      this.goalStatusForm.data.questionList.filter(
        (goal: any) => goal.ratio === 0
      ).length === 0;

    if (!this.isAllRatiosAreSet) {
      this.alertService.callMessage(
        'warn',
        'Dikkat',
        'Sıfır ağırlığa (oran) sahip sorular bulunmaktadır!'
      );
    }

    if (this.totalRatio !== 100) {
      this.alertService.callMessage(
        'warn',
        'Dikkat',
        'Ağırlık toplamları 100 olmalıdır. Toplam: ' + this.totalRatio
      );
    }
  }

  onSubmit() {
    if (
      !this.goalStatusForm?.pagePeriodStatusId ||
      !this.isAllRatiosAreSet ||
      this.totalRatio !== 100
    )
      return;

    const formData = {
      pageProcessId: this.goalStatusForm.pageProcessId,
      pagePeriodStatusId: this.goalStatusForm.pagePeriodStatusId,
      data: {
        questionList: this.goalStatusForm.data.questionList,
      },
    };

    formData.data.questionList = formData.data.questionList.map(
      (question: any) => {
        if (question.isNew) {
          const {
            isNew,
            questionId,
            questionTypeTitle,
            mainCategoryTitle,
            categoryTitle,
            subCategoryTitle,
            performanceCategoryTitle,
            ...rest
          } = question;

          return {
            ...rest,
            questionId: null,
            performanceEmployeeQuestionId: null,
          };
        } else {
          const {
            questionTypeTitle,
            mainCategoryTitle,
            categoryTitle,
            subCategoryTitle,
            performanceCategoryTitle,
            ...rest
          } = question;

          return rest;
        }
      }
    );

    this.loading = true;
    this.goalsService
      .updateGoal(formData)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          this.getGoals();

          this.alertService.callMessage(
            'success',
            'İşlem Başarılı',
            `${this.performanceSubject}leriniz kaydedilmiştir.`
          );
        },
        error: (error) => {
          this.alertService.callMessage(
            'error',
            'İşlem Başarısız',
            'Kaydetme işlemi gerçekleşmedi'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
