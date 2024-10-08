export interface IPageMenuItem {
    id: number;
    pageId: number | null;
    page:string;
    title: string;
    titleTR: string;
    titleEN: string;
    icon: string;
    parentId: number | null;
    parent:string;
    orderId: number | null;
}
