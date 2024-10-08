import { Pipe, PipeTransform } from '@angular/core';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { IEmployeeItem } from 'src/app/modules/admin/models/employee.model';

@Pipe({
  name: 'managerEmployee'
})
export class ManagerEmployeePipe implements PipeTransform {
  transform(data: IEmployeeItem[] | null) {
    let dropdownOptions: SelectItemGroup[] = [];

    if (data) {
      const managerEmployees: SelectItem[] = Array.from(
        new Map(
          data
            .filter((employee) => employee.managerEmployee)
            .map((employee) => [
              employee.managerEmployeeId,
              { value: employee.managerEmployeeId, label: employee.managerEmployee ? employee.managerEmployee : '' }
            ])
        ).values()
      ).sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        return 0;
      });

      const employees = data
        .filter((employee) => !managerEmployees.some((manager) => manager.value === employee.id))
        .map((employee) => {
          return { value: employee.id, label: employee.fullName };
        })
        .sort((a, b) => {
          if (a.label < b.label) return -1;
          if (a.label > b.label) return 1;
          return 0;
        });
      dropdownOptions = [
        { label: 'Yöneticiler', items: managerEmployees },
        { label: 'Çalışanlar', items: employees }
      ];
    }

    return dropdownOptions;
  }
}
