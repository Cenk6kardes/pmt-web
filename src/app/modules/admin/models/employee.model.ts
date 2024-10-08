export interface IEmployeeItem {
  id: string ;
  email: string;
  identityNo: string;
  firstName: string;
  midName: string;
  lastName: string;
  fullName: string;
  directorshipId: number | null;
  directorship: string | null;
  departmentId: number | null;
  department: string | null;
  startDate: Date | string | null;
  managerEmployeeId: string | null;
  managerEmployee: string | null;
  isQuit: boolean;
  quitDate: Date | string | null;
  createdDate: string | null;
  createdBy: string | null;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  isRemoved: boolean;
}

export type EmployeeItemRequest = Omit<IEmployeeItem, 'startDate' | 'quitDate'> & { startDate: string, quitDate: string | null };
