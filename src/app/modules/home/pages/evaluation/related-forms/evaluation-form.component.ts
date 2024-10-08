import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { EvaluationService } from '../services/evaluation.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss'],
})
export class EvaluationFormComponent implements OnInit, OnDestroy, DoCheck {
  evaluation: any = {
    evaluationSection: { title: '' },
  };
  tabs: {
    title: string;
    tabNumber: number;
    content: string;
    templateIndex?: number;
    templateId?: string;
  }[] = [];
  activeIndex: number = 0;
  prevActiveIndex: number = -1;
  today = new Date();
  templateIndex: any = 0;
  titleIndexMap: any = [];
  questionMap: { [key: string]: any } = {};
  includedQuestionMap: { [key: string]: any } = {};
  questionIndexes: { [key: string]: any } = {};
  status = '';
  statusDropdown: { id: string, title: string }[] = [];
  applyStyle: boolean = false;
  isSubmitted: boolean = false;
  returnData: any = {};
  isDefaultRatioNotHundred: boolean = false;
  isQuestionRatioExceed: boolean = false;
  data: any;
  pagePeriodStatusId: any;
  tabMap: any[] = [];
  selectedColumns!: any[];
  dataSource: any[] = [];
  filteredDataSource: any[] = [];
  columnDefs: any[] = [];
  performanceRoleTitleData: any[] = [];
  templateIds: any[] = [];
  reviewerData: any[] = [];
  evaluationSection: any = {};
  loading = true;
  private subscriptionList: Subscription = new Subscription();
  pageProcessId: any;
  formType: string = 'new';
  tabContents: any;
  performanceTitles: any = [];
  scaleTypes: any = [];
  templatesIndexesToSend: any[] = [];
  isTemplateSumValid = true;
  isQuestionSumValid = true;
  isAtLeastOneQuestionIncluded = true;
  isRequiredAlertExists = false;
  isLastTabActive = false; // Not used at the moment but logic was implemented
  sectionSums: { [key: string]: number } = {};
  employeeFilterOptions: any[] = [
    { label: 'Dahil edilenler', value: 'included' },
    { label: 'Dahil edilmeyenler', value: 'excluded' },
  ];
  filterSelection: any = ['included', 'excluded'];

  constructor(
    private evaluationService: EvaluationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.subscriptionList.add(
      this.route.params.subscribe((params: any) => {
        this.pageProcessId = params.id;

        if (this.pageProcessId) {
          this.formType = 'edit';
        } else {
          this.formType = 'new';
        }
      })
    );
  }

  ngDoCheck() {
    if (this.activeIndex !== this.prevActiveIndex) {
      this.prevActiveIndex = this.activeIndex;

      if (this.tabs[this.activeIndex - 1]) {
        this.templateIndex = this.tabs[this.activeIndex - 1].templateIndex;
      }
    }
  }

  ngOnInit() {
    this.columnDefs = [
      { field: "identityNo", header: "id" },
      { field: "fullName", header: "Çalışan" },
      { field: "directorship", header: "Directorship" },
      { field: "department", header: "Department" },
      { field: "exceptionalManagerId", header: "Değerlendiren" },
    ];
    this.selectedColumns = this.columnDefs;
    this.getEvaluationDetails();
  }

  getEvaluationDetails(): void {
    this.subscriptionList.add(
      this.evaluationService
        .getEvaluationDetails(this.pageProcessId)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            if (this.formType === 'edit') {
              this.tabContents = res.data?.performancesSection; // edit için
            } else {
              this.tabContents = res.data?.selectionPerformanceTemplates; // sıfırdan gelirsek
            }
            this.statusDropdown = [...res.selectionStatuses];
            this.dataSource = res.data?.employeesSection;
            this.filteredDataSource = [...this.dataSource];
            this.reviewerData = res.data?.selectionEmployees;
            this.evaluation = res.data;

            this.tabContents.forEach((templates: any, index: any) => {
              this.performanceTitles.push({
                title: templates.title,
                templateId: templates.performanceTemplateId,
                templateIndex: index,
              });
            });

            this.evaluation.selectionQuestionScaleTypes.forEach(
              (scaleType: any) => {
                this.scaleTypes.push({
                  title: scaleType.title,
                  scaleTypeId: scaleType.id,
                });
              }
            );

            this.dataSource.forEach((employee) => {
              let manager = this.reviewerData.find(
                (manager) => manager.id === employee.exceptionalManagerId
              );

              if (manager) {
                employee.exceptionalManagerFullName = manager.fullName;
                employee.exceptionalManagerId = manager.id;
              }
            });
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

  getQuestions() {
    this.questionMap = {};
    this.includedQuestionMap = {}
    this.tabContents[this.templateIndex].questions.forEach(
      (question: any, index: number) => {
        if (this.questionMap[question.employeeRoleTitle]) {
          this.questionMap[question.employeeRoleTitle] = [
            ...this.questionMap[question.employeeRoleTitle],
            index,
          ];
        } else {
          this.questionMap[question.employeeRoleTitle] = [index];
        }
        this.includedQuestionMap = this.questionMap 
      }
    );

    return Object.keys(this.questionMap);
  }

  templateSwitch(event: any, rowData: any, templateId: any) {
    rowData.isTemplateExcluded = {
      ...rowData.isTemplateExcluded,
      [templateId]: { isDefaultExcluded: !event.checked },
    };
  }

  templateIncluded(rowData: any, col: any) {
    if (rowData.templateOptionRoles[col.templateId]) {
      return rowData.templateOptionRoles[col.templateId][0].isDefaultExcluded;
    }
  }

  roleUpdater(rowData: any, col: any) {
    if (
      rowData.templateRoles[col.templateId] &&
      rowData.templateRoles[col.templateId].length < 2
    ) {
      return rowData.templateRoles[col.templateId][0];
    } else {
      return '';
    }
  }

  ratioCalculator() {
    let sum = 0;
    let activeTemplates = this.templatesIndexesToSend.map((templateIndex) => {
      return this.tabContents[templateIndex];
    });

    activeTemplates.forEach((template: any) => {
      sum += template.performanceDefaultRatio;
    });

    this.isDefaultRatioNotHundred = (sum !== 100);
  }

  questionRatioCalculator(templateIndex: any) {
    const keys = Object.keys(this.questionMap);

    for (let key in this.questionMap) {
      this.sectionSums[key] = 0;
    }

    this.tabContents[templateIndex].questions
      .filter((question: any) => !question.isExcluded)
      .forEach((question: any) => {
        this.sectionSums[question.employeeRoleTitle] += question.ratio;
      });
  }

  templateRolesMatcher() {
    this.dataSource.forEach((item) => {
      const correspondingItem = this.reviewerData.find(secondItem => secondItem.id === item.employeeId);

      if (correspondingItem) {
        item.isExcluded = correspondingItem.isDefaultExcluded;
        item.isExcluded = correspondingItem.isDefaultExcluded;
        item.templateRoles = correspondingItem.templateRoles;
        item.templateOptionRoles = JSON.parse(JSON.stringify(correspondingItem.templateRoles));
      } else {
        console.error(
          `Corresponding item not found for item with id ${item.id}`
        );
      }
    });
  }

  onFilterChange(event: any) {
    this.filterSelection = event.value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.filterSelection.includes('excluded') && !this.filterSelection.includes('included')) {
      this.filteredDataSource = this.dataSource.filter(item => {
        return item.isTemplateExcluded && Object.values(item.isTemplateExcluded).some((template: any) => {
          return (template as { isDefaultExcluded: boolean }).isDefaultExcluded;
        });
      });
    } else if (this.filterSelection.includes('included') && !this.filterSelection.includes('excluded')) {
      this.filteredDataSource = this.dataSource.filter(item => {
        // Include items that don't have the isTemplateExcluded property
        if (!item.isTemplateExcluded) {
          return true;
        }
        // Check if all isDefaultExcluded values are false
        return Object.values(item.isTemplateExcluded).every((template: any) => {
          return !(template as { isDefaultExcluded: boolean }).isDefaultExcluded;
        });
      });
    } else {
      // Reset to show all data
      this.filteredDataSource = [...this.dataSource];
    }
  }

  templateRenderer(event: any, element: Dropdown) {
    const tabExist = this.tabs.find(tab => {
      return tab.title === event.value.title;
    });

    if (!tabExist) {
      element.setDisabledState(true);
      this.templateIndex = event.value.templateIndex;

      if (this.templatesIndexesToSend.indexOf(this.templateIndex) === -1) {
        this.templatesIndexesToSend.push(this.templateIndex);
      }

      this.tabs[this.activeIndex - 1].title = event.value.title;
      this.tabs[this.activeIndex - 1].templateId = event.value.templateId;
      this.tabs[this.activeIndex - 1].templateIndex = event.value.templateIndex;
      const tabIndex = this.tabs.findIndex(
        (x) => x.tabNumber === this.activeIndex
      );
      this.columnDefs.splice(6, this.tabs.length);
      this.tabs.forEach((tab: any, index: number) => {
        if (tabIndex >= 0 && this.tabs[this.activeIndex - 1].title) {
          this.columnDefs.push({
            field: `template`,
            header: this.tabs[index].title,
            templateId: this.tabs[index].templateId,
          });
          this.columnDefs[6 + index].header = this.tabs[index].title;
          this.columnDefs[6 + index].field = `template`;
          this.columnDefs[6 + index].templateId = this.tabs[index].templateId;
        }
      });

      this.ratioCalculator();
      this.templateRolesMatcher();
    } else {
      this.alertService.callMessage(
        'error',
        'İşlem Başarısız',
        'Aynı Şablondan Birden Fazla Eklenemez'
      );
    }
  }

  getIncludedQuestionsCount(templateIndex: number, questionMainCategoryTitle: string): number {
    if (!this.tabContents[templateIndex].questions) {
      return 0;
    }
    const questions = this.tabContents[templateIndex].questions.filter((question: any) => question.employeeRoleTitle === questionMainCategoryTitle);
    let count = 0;
    for (const key in questions) {
      
      if (questions.hasOwnProperty(key) && !questions[key].isExcluded) {
        count++;
      }
    }
    return count;
  }

  getColumnFieldForTemplate() {
    return `template`;
  }

  ratioChange(event: any) {
    this.evaluation.selectionPerformanceTemplates[
      this.templateIndex
    ].defaultRatio = event.target.value;
  }

  selectedEmployee() {
    return this.dataSource.map((data: any) => {
      return data.roles;
    });
  }

  isQuestionIncluded(event: any, question: any) {
    this.tabContents[this.templateIndex].questions[question].isExcluded = !event.checked;
    this.questionRatioCalculator(this.templateIndex);
  }

  dateUpdate(event: string, propToBeUpdated: string, period: any) {
    if (event) {
      let date = new Date(event);
      period[propToBeUpdated] = date.toISOString();
    } else {
      return;
    }
  }

  blockDateInput(e: KeyboardEvent): void {
    e.preventDefault();
  }

  getEmployeeLevels() {
    return this.dataSource.map((employee: any) => {
      return employee.roles.map((role: any) => {
        return { id: role.id, title: role.title };
      });
    });
  }

  performanceEmployeeTitleSelection(roleSelection: any) {
    if (roleSelection[0]) {
      return roleSelection[0].id;
    }
  }

  tabChange(e: any) {
    this.isLastTabActive = e.index + 1 === this.tabs.length + 3;

    if (this.tabs.length + 1 === this.activeIndex) {
      setTimeout(() => {
        this.activeIndex--;
      }, 0);
    }
  }

  addNewTab(isOnNext?: boolean) {
    let lastTabNumber = this.tabs[this.tabs.length - 1]?.tabNumber
      ? this.tabs[this.tabs.length - 1].tabNumber
      : 0;
    this.tabs.push({
      title: String(lastTabNumber + 1),
      tabNumber: lastTabNumber + 1,
      content: '',
    });

    if (this.tabs.length + 1 === this.activeIndex) {
      this.activeIndex -= 2;
    }

    if (isOnNext && this.tabs.length === 1) {
      setTimeout(() => {
        this.activeIndex = 1;
      }, 0);
    }
  }

  deleteSelectedTab(tabNumber: number) {
    if (this.templatesIndexesToSend.indexOf(this.templateIndex) !== -1) {
      this.templatesIndexesToSend.splice(
        this.templatesIndexesToSend.indexOf(this.templateIndex),
        1
      );
    }
    let header = this.tabs[this.activeIndex - 1];
    let index = this.columnDefs.findIndex(
      (col) => col.templateId === header.templateId
    );
    this.columnDefs.splice(index, 1);
    this.activeIndex--;
    this.tabs = this.tabs.filter((tab) => tab.tabNumber !== tabNumber);
    this.templateIndex--;
    //this.performanceTitles.push({ title: templates.title, templateId: templates.performanceTemplateId, templateIndex: index })
  }

  formValidator() {
    this.ratioCalculator();
    //Check neccessary fields before running saveCrew
    this.isAtLeastOneQuestionIncluded = this.tabContents[this.templateIndex]?.questions?.some((question: { isExcluded: boolean; }) => !question.isExcluded);
    const requiredErrorElements = document.querySelectorAll('[id$=\'-help\']');
    const smallElements: Element[] = Array.from(requiredErrorElements);

    for (const element of smallElements) {
      element.innerHTML === 'Zorunlu alan' ? this.isRequiredAlertExists = true : '';
    }

    !this.evaluation.evaluationSection.finalScoreScaleTypeId ? this.isRequiredAlertExists = true : '';

    if (!this.status) this.isRequiredAlertExists = true;

    for (const key in this.sectionSums) {
      this.sectionSums[key] !== 100 ? this.isQuestionSumValid = false : '';
    }
  }

  saveCrew() {
    let alertShown = false;
    this.isSubmitted = true;
    this.formValidator();
    
    if (this.isRequiredAlertExists) {
      this.alertService.callMessage(
        'error',
        'Hata',
        'Lütfen tüm zorunlu alanları doldurun'
      );
      alertShown = true;
    }

    if (this.isDefaultRatioNotHundred) {
      this.alertService.callMessage(
        'error',
        'Hata',
        'Lütfen şablon toplamlarını kontrol edin!'
      );
      alertShown = true;
    }

    if (!this.isQuestionSumValid) {
      this.alertService.callMessage(
        'error',
        'Hata',
        'Lütfen soru toplamlarını kontrol edin!'
      );
      alertShown = true;
    }
    
    if (!this.isAtLeastOneQuestionIncluded) {
      this.alertService.callMessage(
        'error',
        'Hata',
        'Lütfen en az bir tane sorunun dahil edilmiş olduğundan emin olun.'
      );
      alertShown = true;
    }

    this.tabs.forEach(tab => {
      const templateId = tab.templateId;

      this.dataSource.forEach(item => {
        if (!item.exceptionalManagerId) {
          this.alertService.callMessage(
            'error',
            'Hata',
            'Lütfen ' + item.fullName + ' için bir yönetici seçin.'
          );
          alertShown = true;
        }

        if (!item.isTemplateExcluded) {
          //If there is no isTemplateExcluded data it means switch is on
          if (!item.templateRoles.hasOwnProperty(tab.templateId)) {
            if (!alertShown) {
              this.alertService.callMessage(
                'error',
                'Eksik şablon',
                'Lütfen için bir rol seçildiğinden emin olun.'
              );
              alertShown = true;
            }
          }
        } else {
          if (item.isTemplateExcluded.hasOwnProperty(tab.templateId).isDefaultExcluded === false) {
            if (!item.templateRoles.hasOwnProperty(tab.templateId)) {
              if (!alertShown) {
                this.alertService.callMessage(
                  'error',
                  'Eksik şablon',
                  'Lütfen dahil edilmiş her çalışan için bir rol seçildiğinden emin olun.'
                );
                alertShown = true;
              }
            }
          }
        }
      });
    });

    if (alertShown) {
      this.isTemplateSumValid = true;
      this.isQuestionSumValid = true;
      this.isAtLeastOneQuestionIncluded = true;
      this.isRequiredAlertExists = false;

      return;
    }

    this.returnData.data = {};
    this.returnData.pageProcessId = null;
    this.returnData.pagePeriodStatusId = this.status;
    this.returnData.data.evaluationSection = this.evaluation.evaluationSection;
    this.returnData.data.performancesSection = [];
    this.returnData.data.performancesSection = JSON.parse(
      JSON.stringify(
        this.templatesIndexesToSend.map((templateIndex, index: number) => {
          this.tabContents[templateIndex].performanceOrder = index + 1;
          return this.tabContents[templateIndex];
        })
      )
    );
    this.reviewerData.forEach((item, index) => {
      const correspondingItem = this.dataSource.find(secondItem => secondItem.id === item.employeeId);

      if (correspondingItem) {
        item.templateRoles = correspondingItem.templateRoles
      }
    });

    const dataSourceTemp = JSON.parse(JSON.stringify(this.dataSource));
    dataSourceTemp.forEach((employeesSectionItem: any) => {
      this.returnData.data.performancesSection.map((performancesSectionItem: any) => {
        const performanceId = performancesSectionItem.performanceTemplateId;
        const performanceOrder = performancesSectionItem.performanceOrder;
        const exceptionalEmployeeRoleId = employeesSectionItem?.templateRoles?.[performanceId] ? employeesSectionItem?.templateRoles?.[performanceId][0].id : null;
        const isExcluded = employeesSectionItem.isTemplateExcluded?.[performanceId] ?  employeesSectionItem.isTemplateExcluded?.[performanceId]?.isDefaultExcluded : false;
        employeesSectionItem.employeePerformances = [
          ...employeesSectionItem.employeePerformances,
          {
            'performanceOrder': performanceOrder,
            'performanceId': null,
            'exceptionalEmployeeRoleId': exceptionalEmployeeRoleId,
            'isExcluded': isExcluded
          }
        ];
      });
    });

    dataSourceTemp.forEach((item: any) => {
      delete item.exceptionalManagerFullName;
      delete item.templateRoles;
      delete item.templateOptionRoles;
      delete item.isTemplateExcluded;
      delete item.isExcluded;

      return item;
    });

    this.returnData.data.employeesSection = dataSourceTemp;
    this.returnData.data.performancesSection.forEach((item: any) => {
      delete item.title;
      item.questions.forEach((question: any) => {
        delete question.questionMainCategoryTitle;
        delete question.questionCategoryTitle;
        delete question.questionSubCategoryTitle;
        delete question.employeeRoleTitle
        delete question.questionTitle
      });
    });

    this.subscriptionList.add(
      this.evaluationService
        .createEvaluationForm(this.returnData)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe({
          next: (res: any) => {
            this.alertService.callMessage(
              'success',
              'İşlem Başarılı',
              'Kayıt Başarılı.'
            );
            this.router.navigateByUrl('evaluation/list');
          },
          error: (error: any) => {
            this.alertService.callMessage(
              'error',
              'İşlem Başarısız',
              'Kayıt Başarısız'
            );
          },
        })
    );
  }

  onNext(isOnNext: boolean) {
    this.addNewTab(isOnNext);
    setTimeout(() => {
      this.activeIndex = 1;
    }, 0);
  }

  onPrevious(lastPage?: boolean) {
    this.activeIndex--;

    if (lastPage) {
      this.activeIndex--;
    }
  }

  onPage() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

  get globalFilterFields() {
    return this.columnDefs.map((column) => column['field']);
  }

  ngOnDestroy(): void {
    this.subscriptionList.unsubscribe();
  }
}
