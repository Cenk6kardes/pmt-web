import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AdminPagesService } from '../../services/admin-pages.service';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';

import { AdminDataGeneric } from '../../models/generic-admin-data.model';
import { EmployeeItemRequest, IEmployeeItem } from '../../models/employee.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IEmployeeUnitItem } from '../../models/employee-unit.model';
import { EmptyFieldValue } from '../../models/empty-field-value.model';

@Component({
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [MessageService]
})
export class EmployeeComponent implements OnInit, OnDestroy {
  pageHeader = 'Çalışan Tanımları';
  itemDialog: boolean = false;
  deleteItemDialog: boolean = false;
  items: IEmployeeItem[] = [];
  itemDefaults: IEmployeeItem = {
    id: '',
    email: '',
    identityNo: '',
    firstName: '',
    midName: '',
    lastName: '',
    fullName: '',
    directorshipId: null,
    directorship: null,
    departmentId: null,
    department: null,
    startDate: null,
    managerEmployeeId: '',
    managerEmployee: null,
    isQuit: false,
    quitDate: null,
    createdDate: null,
    createdBy: null,
    lastModifiedDate: null,
    lastModifiedBy: null,
    isRemoved: false
  };
  item: IEmployeeItem = this.itemDefaults;
  submitted: boolean = false;
  cols: { field: string; header: string }[] = [];
  stateOptions = [
    { label: 'Ayrıldı', value: true },
    { label: 'Çalışıyor', value: false }
  ];

  form = this.formBuilder.group({
    id: [{ value: this.item.id, disabled: true }, [Validators.required]],
    email: [this.item.email, Validators.required],
    identityNo: [this.item.identityNo, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
    firstName: [this.item.firstName, Validators.required],
    midName: [this.item.midName],
    lastName: [this.item.lastName, Validators.required],
    fullName: [this.item.fullName],
    directorshipId: [this.item.directorshipId, Validators.required],
    departmentId: [this.item.departmentId, Validators.required],
    startDate: [this.item.startDate, Validators.required],
    managerEmployeeId: [this.item.managerEmployeeId, Validators.required],
    isQuit: [this.item.isQuit, Validators.required],
    quitDate: [this.item.quitDate],
    createdDate: [this.item.createdDate],
    createdBy: [this.item.createdBy],
    lastModifiedDate: [this.item.lastModifiedDate],
    lastModifiedBy: [this.item.lastModifiedBy],
    isRemoved: [this.item.isRemoved]
  });

  loading = false;
  private subscriptionList$$: Subscription = new Subscription();
  private _path = 'employee';

  private get firstName() {
    return this.form.get('firstName');
  }

  private get midName() {
    return this.form.get('midName');
  }

  private get lastName() {
    return this.form.get('lastName');
  }

  private get fullName() {
    return this.form.get('fullName');
  }

  employeeManagerList$: Observable<IEmployeeItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeItem>>(this._path)
    .pipe(map((response) => response.list));
  directorShipList$: Observable<IEmployeeUnitItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeUnitItem>>('employeeunit')
    .pipe(
      map(
        (employeeUnits: AdminDataGeneric<IEmployeeUnitItem>) => employeeUnits.list.filter((employeeUnit: IEmployeeUnitItem) => employeeUnit.groupNo === 1)
      ));
  departmentList$: Observable<IEmployeeUnitItem[]> = this.adminPagesService
    .getList<AdminDataGeneric<IEmployeeUnitItem>>('employeeunit')
    .pipe(
      map(
        (employeeUnits: AdminDataGeneric<IEmployeeUnitItem>) => employeeUnits.list.filter((employeeUnit: IEmployeeUnitItem) => employeeUnit.groupNo === 2)
      ));

  constructor(
    private formBuilder: FormBuilder,
    private adminPagesService: AdminPagesService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ listData }) => {
      this.items = listData.list;
    });

    this.cols = [
      { field: 'email', header: 'E-Posta' },
      { field: 'identityNo', header: 'Kimlik No' },
      { field: 'fullName', header: 'Ad Soyad' },
      { field: 'directorship', header: 'Direktörlük' },
      { field: 'department', header: 'Departman' },
      { field: 'startDate', header: 'Çalışma Dönemi' },
      { field: 'managerEmployee', header: 'Yöneticisi' },
      { field: 'isQuit', header: 'Durum' }
    ];
  }

  private _getItem(id: string): void {
    this.loading = true;

    this.subscriptionList$$.add(
      this.adminPagesService
        .getItem<AdminDataGeneric<IEmployeeItem>>(id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((data: AdminDataGeneric<IEmployeeItem>) => {
          if (id && data.item) {
            let modifiedItem = data.item;

            if (typeof data.item.startDate === 'string') {
              modifiedItem.startDate = new Date(data.item.startDate);
            }

            if (typeof data.item.quitDate === 'string') {
              modifiedItem.quitDate = new Date(data.item.quitDate);
            }

            modifiedItem.email = data.item.email.replace('@orioninc.com', '');

            this.form.reset(modifiedItem);
          } else {
            this.items = data.list;
          }
        })
    );
  }

  openNew() {
    this.item = this.itemDefaults;
    this.form.reset(this.item);
    this.submitted = false;
    this.itemDialog = true;
  }

  editItem(item: IEmployeeItem) {
    this._getItem(item.id);
    this.item = { ...item };
    this.itemDialog = true;
  }

  deleteItem(item: IEmployeeItem) {
    this.deleteItemDialog = true;
    this.item = { ...item };
  }

  confirmDelete() {
    this.loading = true;
    this.deleteItemDialog = false;

    this.subscriptionList$$.add(
      this.adminPagesService
        .deleteItem(this.item.id, this._path)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe((response: boolean | null) => {
          if (response) {
            this.item = this.itemDefaults;
            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.', life: 3000 });
            this._getItem('');
          }
        })
    );
  }

  quitValidator() {
    if (this.form.get('isQuit')?.value) {
      this.form.get('quitDate')?.addValidators(Validators.required);
    } else {
      this.form.get('quitDate')?.reset();
      this.form.get('quitDate')?.clearValidators();
    }

    this.form.get('quitDate')?.updateValueAndValidity();
  }

  hideDialog() {
    this.itemDialog = false;
    this.submitted = false;
    this.form.reset(this.itemDefaults);
    this.quitValidator();
  }

  formatSubmittedItem() {
    let email = this.form.get('email');

    if (email?.value && !email.value.includes('@orioninc.com')) {
      email?.setValue(email.getRawValue() + '@orioninc.com');
    }

    this.fullName?.setValue(this.firstName?.value + ' ' + this.midName?.value + ' ' + this.lastName?.value);

    this.item = this.form.getRawValue() as IEmployeeItem;
  }

  saveItem() {
    this.loading = true;
    this.submitted = true;
    this.formatSubmittedItem();

    const modifiedItem: EmployeeItemRequest = {
      ...this.item,
      startDate: (this.item.startDate as Date).toISOString(),
      quitDate: this.item.quitDate ? (this.item.quitDate as Date).toISOString() : null
    };

    this.subscriptionList$$.add(
      this.item.id
        ? this.adminPagesService
          .editItem<AdminDataGeneric<EmployeeItemRequest>>({ data: { item: modifiedItem, list: [] } }, this._path)
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe((response: boolean | null) => {
            if (response) {
              this.hideDialog();
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Kaydedildi.',
                life: 3000
              });
              this._getItem('');
            }
          })
        : this.adminPagesService
          .createItem<AdminDataGeneric<EmployeeItemRequest>>(
            { data: { item: { ...modifiedItem, id: EmptyFieldValue.UUID }, list: [] } },
            this._path
          )
          .pipe(
            finalize(() => {
              this.loading = false;
            })
          )
          .subscribe((response: boolean | null) => {
            if (response) {
              this.hideDialog();
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Kaydedildi.',
                life: 3000
              });
              this._getItem('');
            }
          })
    );
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  ngOnDestroy(): void {
    this.subscriptionList$$.unsubscribe();
  }
}
