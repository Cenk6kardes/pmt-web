export interface IPerformanceTemplateItem {
  id: string;
  performanceCategoryId: number | null;
  performanceCategory: string;
  title: string;
  description: string;
  defaultRatio: number | null;
}
