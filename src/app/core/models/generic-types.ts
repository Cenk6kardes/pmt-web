export interface IAuthPage {
    hasView: boolean;
    hasEdit: boolean;
    hasInsert: boolean;
    hasDelete: boolean;
}

export interface IAuthItem {
    name: string;
    isVisible: boolean;
    isEnabled: boolean;
}

export interface ISimpleItem {
    id: string;
    title: string;
}

export interface IResponse<T> {
    pageProcessId?: string | null;
    authPage?: Partial<IAuthPage>;
    authFields?: Record<string, IAuthItem>;
    status?: string | null;
    selectionStatuses?: ISimpleItem[];
    success: boolean;
    message: string;
    data: T;
    description:string;
}

export interface IRequest<T> {
    pageProcessId?: string | null;
    pagePeriodStatusId?: string | null;
    data: T;
}

export interface IDeleteRequest {
    id: number | string;
}
