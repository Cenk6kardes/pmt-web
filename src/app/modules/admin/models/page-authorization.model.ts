export interface IPageAuthorizationItem {
  id: number;
  pageId: number | null;
  page: string | null ;
  employeeRoleId: string;
  employeeRole: string | null;
  pagePeriodStatusId: string;
  pagePeriodStatus: string | null;
  performanceCategoryId: number | null;
  performanceCategory: string | null;
  hasView: boolean;
  hasInsert: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  createdDate: string | null;
  createdBy: string | null;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  isRemoved: boolean;
}
