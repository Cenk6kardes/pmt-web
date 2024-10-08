import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AdminPagesService } from '../../services/admin-pages.service';

import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { IPageFieldAuthorizationItem } from '../../models/page-field-authorization.model';
import { AdminDataGeneric } from '../../models/generic-admin-data.model';

import { finalize, map, Observable, Subscription } from 'rxjs';
import { IPageAuthorizationItem } from '../../models/page-authorization.model';

@Component({
    templateUrl: './page-field-authorization.component.html',
    styleUrls: ['./page-field-authorization.component.scss'],
    providers: [MessageService]
})
export class PageFieldAuthorizationComponent implements OnInit, OnDestroy {
    pageHeader = 'Sayfa Alan Yetkilendirmeleri';
    itemDialog: boolean = false;
    deleteItemDialog: boolean = false;
    items: IPageFieldAuthorizationItem[] = [];
    itemDefaults: IPageFieldAuthorizationItem = {
        id: 0,
        pageAuthorizationId: null,
        name: '',
        isVisible: false,
        isEnabled: false,
    };
    item: IPageFieldAuthorizationItem = this.itemDefaults;
    submitted: boolean = false;
    cols: {field: string, header: string}[] = [];

    form = this.formBuilder.group({
        id: [{ value: this.item.id, disabled: true }, [Validators.required]],
        pageAuthorizationId: [this.item.pageAuthorizationId, Validators.required],
        name: [this.item.name, Validators.required],
        isVisible: [this.item.isVisible, Validators.required],
        isEnabled: [this.item.isEnabled, Validators.required]
    });

    loading = false;
    private subscriptionList$$: Subscription = new Subscription();
    private _path = 'pagefieldauthorization';

    pageAuthorizationIdList$: Observable<IPageAuthorizationItem[]> = this.adminPagesService
        .getList<AdminDataGeneric<IPageAuthorizationItem>>('pageauthorization')
            .pipe(map((response: AdminDataGeneric<IPageAuthorizationItem>) => response.list));

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
            { field: 'id', header: 'Id' },
            { field: 'pageAuthorizationId', header: 'Sayfa Yetki Id' },
            { field: 'name', header: 'Ad' },
            { field: 'isVisible', header: 'Görüntülenebilir' },
            { field: 'isEnabled', header: 'Etkin' }
        ];
    }

    private _getItem(id: number): void {
        this.loading = true;
        
        this.subscriptionList$$.add(
            this.adminPagesService.getItem<AdminDataGeneric<IPageFieldAuthorizationItem>>(id, this._path)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((data: AdminDataGeneric<IPageFieldAuthorizationItem> ) => id ? this.form.reset(data.item!) :  this.items = data.list)
        );
    }

    openNew() {
        this.item = this.itemDefaults;
        this.form.reset(this.item);
        this.submitted = false;
        this.itemDialog = true;
    }

    deleteItem(item: IPageFieldAuthorizationItem) {
        this.deleteItemDialog = true;
        this.item = { ...item };
    }

    confirmDelete() {
        this.loading = true;
        this.deleteItemDialog = false;

        this.subscriptionList$$.add(
            this.adminPagesService.deleteItem(this.item.id, this._path)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe((response: boolean | null) => {
                    if (response) {
                        this.item = this.itemDefaults;
                        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Silindi.', life: 3000 });
                        this._getItem(0);
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
        this.item = this.form.getRawValue() as IPageFieldAuthorizationItem;

        this.subscriptionList$$.add(
                this.adminPagesService.createItem<AdminDataGeneric<IPageFieldAuthorizationItem>>({ data: { item: this.item, list: [] } }, this._path)
                    .pipe(
                        finalize(() => {
                            this.loading = false;
                        })
                    )
                    .subscribe((response: boolean | null) => {
                        if (response) {
                            this.hideDialog();
                            this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kaydedildi.', life: 3000 });
                            this._getItem(0);
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
