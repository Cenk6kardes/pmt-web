import { IEmployeeRoleItem } from './employee-role.model';
import { IEmployeeItem } from './employee.model';
import { IPageAuthorizationStatusItem } from './page-auth-status.model';
import { IPageAuthorizationItem } from './page-authorization.model';
import { IPageDetailItem } from './page-detail.model';
import { IPageStatusItem } from './page-status.model';
import { IPerformanceTemplateItem } from './performance-template.model';
import { IQuestionTypeItem } from './question-type.model';
import { IQuestionScaleTypeItem } from './question-scale-type.model';
import { IWidgetPermissionItem } from './widget-permission.model';
import { IWidgetItem } from './widget.model';
import { IPerformanceCategoryItem } from './performance-category.model';
import { IPerformanceTemplateQuestion } from './performance-template-question.model';
import { IPageMenuPermission } from './page-menu-permission.model';
import { IPageMenuItem } from './page-menu-item.model';
import { IQuestionScaleTypeValueItem } from './question-scale-type-value.model';
import { IPageStatusDirection } from './page-status-direction.model';
import { IEmployeeUnitItem } from './employee-unit.model';
import { IPeriodItem } from './period.model';
import { IQuestionCategory } from './question-category.model';
import { IEmployeeRoleTypeItem } from './employee-role-type.model';
import { IPagePeriodStatusItem } from './page-period-status.model';
import { IPerformanceTemplatePeriodItem } from './performance-template-period.model';
import { IPageStatusScopeItem } from './page-status-scope.model';

export type listTypes =
  | IPageDetailItem
  | IWidgetItem
  | IEmployeeItem
  | IPageAuthorizationItem
  | IPageAuthorizationStatusItem
  | IPageStatusItem
  | IWidgetPermissionItem
  | IPerformanceTemplateItem
  | IQuestionTypeItem
  | IQuestionScaleTypeItem
  | IPerformanceCategoryItem
  | IPerformanceTemplateQuestion
  | IPageMenuPermission
  | IPageMenuItem
  | IQuestionScaleTypeValueItem
  | IPageStatusDirection
  | IEmployeeUnitItem
  | IPeriodItem
  | IQuestionCategory
  | IPageStatusScopeItem
  | IEmployeeRoleItem
  | IEmployeeRoleTypeItem
  | IPagePeriodStatusItem
  | IPerformanceTemplatePeriodItem;

export interface AdminDataGeneric<T> {
  item: T | null;
  list: T[];
}
