export interface IWidgetItem {
  id: number;
  title: string;
  cachingTime: number;
  isRemoved: boolean;
  query: string;
  widgetType: string;
}
