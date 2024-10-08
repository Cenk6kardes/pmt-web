import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectItem } from 'primeng/api';

import { ScoringService } from './services/scoring.service';
import { AlertService } from 'src/app/core/services/alert.service';

import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-scoring',
  templateUrl: './scoring.component.html',
  styleUrls: ['./scoring.component.scss'],
})
export class ScoringComponent implements OnInit {
  scoringDetails!: any;
  questions!: any;
  managerReviews!: any;
  people!: any;
  pageProcessId!: string;
  selectionStatuses!: [];
  scaleTypeValues: any = [];
  employeeList: SelectItem[] = [];
  loading!: boolean;
  selectionQuestionScaleTypes: any;
  title = window.history.state.data.title;

  constructor(
    private scoringService: ScoringService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscriptionList.add(
      this.route.params.subscribe((params: any) => {
        this.pageProcessId = params.id;
      })
    );
  }

  toggle = true;
  status = 'Enable';
  statuses: SelectItem[] = [];
  selectedScaleType!: string;
  selectedList: SelectItem = { value: '' };
  selectedStatus: SelectItem = { value: '' };
  private subscriptionList: Subscription = new Subscription();
  sortOptions: SelectItem[] = [
    { label: 'Most Shared', value: 'share' },
    { label: 'Most Commented', value: 'comment' },
  ];

  ngOnInit() {
    this.getScoringDetails();
    this.employeeList = [
      {
        label: 'Koray Taş',
        value: { id: 1, name: 'Koray Taş', code: '23041' },
      },
      {
        label: 'Bugay Sarıkaya',
        value: { id: 2, name: 'Bugay Sarıkaya', code: '22401' },
      },
      {
        label: 'Uğur Mesut Şeker',
        value: { id: 3, name: 'Uğur Mesut Şeker', code: '23101' },
      },
    ];
  }

  getScoringDetails(): void {
    this.loading = true;
    this.subscriptionList.add(
      this.scoringService
        .getScoringDetails(this.pageProcessId)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.questions = this.getQuestionScaleTypes(res.data.questions, res.data.selectionQuestionScaleTypes);
            this.managerReviews = res.data.questionManagerNotes;
            this.selectionStatuses = res.selectionStatuses;
            this.selectionQuestionScaleTypes = res.data.selectionQuestionScaleTypes;
            this.questions = this.mergeManagerReviews(this.questions, this.managerReviews);
          },
          error: (error: any) => {
            this.alertService.callMessage('error', 'İşlem Başarısız', 'Liste verileri yüklenemedi');
          }
        })
    );
  }

  mergeManagerReviews(questions: any[], managerReviews: any[]): any[] {
    return questions.map((question) => {
      question.managerNotes = managerReviews
        .filter((review) => review.questionId === question.questionId)
        .map((review) => {
          const scaleType = this.selectionQuestionScaleTypes
            .flatMap((type: any) => type.values)
            .find((value: any) => value.id === review.questionScaleTypeValueId);

          return {
            ...review,
            scaleTypeTitle: scaleType?.title,
            scaleTypeColor: scaleType?.colorCode
          };
        });
      return question;
    });
  }

  getQuestionScaleTypes(questions: [], scaleTypes: []) {
    return questions.map((question: any) => {
      const matchingScaleType: any = scaleTypes.find((scale: any) => scale.id === question.questionScaleTypeId);

      return {
        ...question,
        scaleType: {
          ...matchingScaleType,
          values: matchingScaleType.values.sort((a: any, b: any) => a.orderId - b.orderId)
        },
      };
    });
  }

  save() {
    const body = {
      pageProcessId: this.pageProcessId,
      pagePeriodStatusId: this.selectedStatus,
      data: {
        questions: this.questions.map((question: any) => ({
          performanceQuestionResultId: question.performanceQuestionResultId,
          questionId: question.questionId,
          performanceEmployeeQuestionsId: question.performanceEmployeeQuestionsId,
          questionScaleTypeValueId: question.questionScaleTypeValueId,
          note: question.note,
        })),
      },
    };

    this.scoringService.updateScoringDetails(this.pageProcessId, body).subscribe({
      next: (res) => {
        this.alertService.callMessage('success', 'Başarılı', 'Veriler kaydedildi');
        this.router.navigate(['/performance/list']);
      },
      error: (error) => {
        this.alertService.callMessage('error', 'İşlem Başarısız', 'Veriler kaydedilemedi');
      },
    });
  }

  listBoxOnSelect(e: any): void {
    const parentEl = e.originalEvent.target.parentElement;
    
    setTimeout(() => { // Don't remove, otherwise clicking other item when first item is already selected will seem as two items is selected 
      for (let listEl of parentEl.children) {
        if (!listEl.classList.contains('p-highlight')) {
          listEl.style.backgroundColor = '#f1f5f9';
          listEl.style.color = '#1e293b';
        }
      }
    }, 0);

    e.originalEvent.target.style.backgroundColor = e.option.colorCode;
    e.originalEvent.target.style.color = '#ffffff';
  }
}
