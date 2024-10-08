import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IEmployeeRoleAssignmentItem } from '../../models/employee-role-assignment.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IEmployeeItem } from '../../models/employee.model';
import { IEmployeeRoleItem } from '../../models/employee-role.model';

@Component({
    templateUrl: './employee-role-assignment.component.html',
    styleUrls: ['./employee-role-assignment.component.scss'],
    providers: [MessageService]
})
export class EmployeeRoleAssignmentComponent implements OnInit, OnDestroy {
    pageHeader = 'Çalışan Rol Tanımları';
    itemDialog: boolean = false;
    deleteItemDialog: boolean = false;
    items: IEmployeeRoleAssignmentItem[] = [];
    itemDefaults: IEmployeeRoleAssignmentItem = {
        employee: '',
        employeeId: '',
        employeeRole: '',
        employeeRoleId: '',
    };
    item: IEmployeeRoleAssignmentItem = this.itemDefaults;
    submitted: boolean = false;
    cols: {field: string, header: string}[] = [];

    form = this.formBuilder.group({
        employeeId: [this.item.employeeId, Validators.required],
        employeeRoleId: [this.item.employeeRoleId, Validators.required]
    });

    loading = false;
    private subscriptionList$$: Subscription = new Subscription();
    private _path = 'employeeroleassignment';

    employeeList$: Observable<IEmployeeItem[]> = this.adminPagesService
        .getList<AdminDataGeneric<IEmployeeItem>>('employee')
            .pipe(map((response: AdminDataGeneric<IEmployeeItem>) => response.list));
    employeeRoleList$: Observable<IEmployeeRoleItem[]> = this.adminPagesService
        .getList<AdminDataGeneric<IEmployeeRoleItem>>('employeerole')
            .pipe(
                map((response: AdminDataGeneric<IEmployeeRoleItem>) => {
                    const sortedList = [...response.list].sort((a, b) => (a.employeeRoleTypeId ?? 0) - (b.employeeRoleTypeId ?? 0));

                    return sortedList;
                })
            );

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private adminPagesService: AdminPagesService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ listData } ) => {
            this.items = listData.list;
        });

        this.cols = [
            { field: 'employee', header: 'Çalışan' },
            { field: 'employeeRole', header: 'Rol' }
        ];
    }

    private _getItem(id: string): void {
        this.loading = true;
        
        this.subscriptionList$$.add(
            this.adminPagesService.getItem<AdminDataGeneric<IEmployeeRoleAssignmentItem>>(id, this._path)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((data: AdminDataGeneric<IEmployeeRoleAssignmentItem> ) => id ? this.form.reset(data.item!) :  this.items = data.list)
        );
    }

    openNew() {
        this.item = this.itemDefaults;
        this.form.reset(this.item);
        this.submitted = false;
        this.itemDialog = true;
    }

    deleteItem(item: IEmployeeRoleAssignmentItem) {
        this.deleteItemDialog = true;
        this.item = { ...item };
    }

    confirmDelete() {
        this.loading = true;
        this.deleteItemDialog = false;

        this.subscriptionList$$.add(
            this.adminPagesService.deleteItem(`id1=${this.item.employeeId}&id2=${this.item.employeeRoleId}`, this._path)
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

    hideDialog() {
        this.itemDialog = false;
        this.submitted = false;
        this.form.reset(this.itemDefaults);
    }

    saveItem() {
        this.loading = true;
        this.submitted = true;
        this.item = this.form.getRawValue() as IEmployeeRoleAssignmentItem;

        this.subscriptionList$$.add(           
                this.adminPagesService.createItem<AdminDataGeneric<IEmployeeRoleAssignmentItem>>({ data: { item: this.item, list: [] } }, this._path)
                    .pipe(
                        finalize(() => {
                            this.loading = false;
                        })
                    )
                    .subscribe((response: boolean | null) => {
                        if (response) {
                            this.hideDialog();
                            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kaydedildi.', life: 3000 });
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
