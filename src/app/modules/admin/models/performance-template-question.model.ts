export interface IPerformanceTemplateQuestion {
  performanceTemplateId: string;
  performanceTemplate: string;
  employeeRoleId: string;
  employeeRole: string;
  questionId: string;
  question: string;
  questionMainCategoryId: number | null;
  questionMainCategory: string;
  questionCategoryId: number | null;
  questionCategory: string;
  questionSubCategoryId: number | null;
  questionSubCategory: string;
  ratio: number | null;
  questionScaleTypeId: number | null;
  questionScaleType: string;
  orderId: number | null;
}
