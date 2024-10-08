export interface IPerformanceTemplatePeriodItem {
  id: number,
  performanceTemplateId: string,
  performanceTemplate: string,
  periodId: number | null,
  period: string,
  isRequired: boolean,
  orderId: number,
}
