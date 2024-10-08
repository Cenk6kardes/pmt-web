import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { CoreApiService } from '../core/services/core-api.service';
import { AlertService } from '../core/services/alert.service';

interface IMenu {
  id: number;
  title: string;
  route: string;
  parentId: number | null;
  orderId: number;
  icon?: string;
  items?: IMenu[];
}

interface ISideBar {
  label: string;
  icon: string;
  routerLink?: string;
  items?: ISideBar[];
  separator?: boolean;
}

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
  model: ISideBar[] = [];

  constructor(private coreApiService: CoreApiService, private alertService: AlertService) {
    this.coreApiService.getDynamicValue().subscribe({
      next: (res: any) => {
        this.model = [
          {
            label: 'Performans Değerlendirme',
            icon: 'pi pi-home',
            items: []
          }
        ];
        if (res.data.length > 0) {
          const menu = res.data;

          const menuMap = new Map<number, IMenu>();
          const topLevelItems: IMenu[] = [];

          menu.forEach((item: IMenu) => menuMap.set(item.id, item));

          menu.forEach((item: IMenu) => {
            if (item.parentId === null) {
              topLevelItems.push(item);
            } else {
              const parent = menuMap.get(item.parentId);
              if (parent) {
                if (!parent.items) {
                  parent.items = [];
                }
                parent.items.push(item);
              }
            }
          });
          this.sortMenuItems(topLevelItems);
          const formattedItems = this.formatMenuItems(topLevelItems);
          if (this.model[0].items) {
            this.model[0].items = [...this.model[0].items, ...formattedItems];
          }
        }
      },
      error: (error) => {
        this.alertService.callMessage('error', 'İşlem Başarısız', 'Veri yüklenemedi');
      }
    });
  }

  sortMenuItems(items: IMenu[]) {
    items.sort((a, b) => a.orderId - b.orderId);
    items.forEach((item) => {
      if (item.items) {
        this.sortMenuItems(item.items);
      }
    });
  }

  formatMenuItems(items: IMenu[]): ISideBar[] {
    const newItems = items.map((item) => {
      const newItem: ISideBar = { label: item.title, icon: item.icon ? "pi " + item.icon : "", routerLink: item.route };
      if (item.items) {
        newItem.items = [];
        newItem.items = this.formatMenuItems(item.items);
      }

      return newItem;
    });

    return newItems;
  }

  ngOnInit() {
    // this.model = [
    //   {
    //     label: 'Performans Değerlendirme',
    //     icon: 'pi pi-home',
    //     items: [
    //       {
    //         label: 'Hedefler',
    //         icon: 'pi pi-fw pi-list',
    //         routerLink: ['/'],
    //       },
    //       {
    //         label: 'İşlemler',
    //         icon: 'pi pi-fw pi-list',
    //         routerLink: ['/operations'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Dashboards',
    //     icon: 'pi pi-home',
    //     items: [
    //       {
    //         label: 'E-Commerce',
    //         icon: 'pi pi-fw pi-home',
    //         routerLink: ['/demo'],
    //       },
    //       {
    //         label: 'Banking',
    //         icon: 'pi pi-fw pi-image',
    //         routerLink: ['/demo/dashboard-banking'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Apps',
    //     icon: 'pi pi-th-large',
    //     items: [
    //       {
    //         label: 'Blog',
    //         icon: 'pi pi-fw pi-comment',
    //         items: [
    //           {
    //             label: 'List',
    //             icon: 'pi pi-fw pi-image',
    //             routerLink: ['/demo/apps/blog/list'],
    //           },
    //           {
    //             label: 'Detail',
    //             icon: 'pi pi-fw pi-list',
    //             routerLink: ['/demo/apps/blog/detail'],
    //           },
    //           {
    //             label: 'Edit',
    //             icon: 'pi pi-fw pi-pencil',
    //             routerLink: ['/demo/apps/blog/edit'],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Calendar',
    //         icon: 'pi pi-fw pi-calendar',
    //         routerLink: ['/demo/apps/calendar'],
    //       },
    //       {
    //         label: 'Chat',
    //         icon: 'pi pi-fw pi-comments',
    //         routerLink: ['/demo/apps/chat'],
    //       },
    //       {
    //         label: 'Files',
    //         icon: 'pi pi-fw pi-folder',
    //         routerLink: ['/demo/apps/files'],
    //       },
    //       {
    //         label: 'Kanban',
    //         icon: 'pi pi-fw pi-sliders-v',
    //         routerLink: ['/demo/apps/kanban'],
    //       },
    //       {
    //         label: 'Mail',
    //         icon: 'pi pi-fw pi-envelope',
    //         items: [
    //           {
    //             label: 'Inbox',
    //             icon: 'pi pi-fw pi-inbox',
    //             routerLink: ['/demo/apps/mail/inbox'],
    //           },
    //           {
    //             label: 'Compose',
    //             icon: 'pi pi-fw pi-pencil',
    //             routerLink: ['/demo/apps/mail/compose'],
    //           },
    //           {
    //             label: 'Detail',
    //             icon: 'pi pi-fw pi-comment',
    //             routerLink: ['/demo/apps/mail/detail/1000'],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Task List',
    //         icon: 'pi pi-fw pi-check-square',
    //         routerLink: ['/demo/apps/tasklist'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'UI Kit',
    //     icon: 'pi pi-fw pi-star-fill',
    //     items: [
    //       {
    //         label: 'Form Layout',
    //         icon: 'pi pi-fw pi-id-card',
    //         routerLink: ['/demo/uikit/formlayout'],
    //       },
    //       {
    //         label: 'Input',
    //         icon: 'pi pi-fw pi-check-square',
    //         routerLink: ['/demo/uikit/input'],
    //       },
    //       {
    //         label: 'Float Label',
    //         icon: 'pi pi-fw pi-bookmark',
    //         routerLink: ['/demo/uikit/floatlabel'],
    //       },
    //       {
    //         label: 'Invalid State',
    //         icon: 'pi pi-fw pi-exclamation-circle',
    //         routerLink: ['/demo/uikit/invalidstate'],
    //       },
    //       {
    //         label: 'Button',
    //         icon: 'pi pi-fw pi-box',
    //         routerLink: ['/demo/uikit/button'],
    //       },
    //       {
    //         label: 'Table',
    //         icon: 'pi pi-fw pi-table',
    //         routerLink: ['/demo/uikit/table'],
    //       },
    //       {
    //         label: 'List',
    //         icon: 'pi pi-fw pi-list',
    //         routerLink: ['/demo/uikit/list'],
    //       },
    //       {
    //         label: 'Tree',
    //         icon: 'pi pi-fw pi-share-alt',
    //         routerLink: ['/demo/uikit/tree'],
    //       },
    //       {
    //         label: 'Panel',
    //         icon: 'pi pi-fw pi-tablet',
    //         routerLink: ['/demo/uikit/panel'],
    //       },
    //       {
    //         label: 'Overlay',
    //         icon: 'pi pi-fw pi-clone',
    //         routerLink: ['/demo/uikit/overlay'],
    //       },
    //       {
    //         label: 'Media',
    //         icon: 'pi pi-fw pi-image',
    //         routerLink: ['/demo/uikit/media'],
    //       },
    //       {
    //         label: 'Menu',
    //         icon: 'pi pi-fw pi-bars',
    //         routerLink: ['/demo/uikit/menu'],
    //         routerLinkActiveOptions: {
    //           paths: 'subset',
    //           queryParams: 'ignored',
    //           matrixParams: 'ignored',
    //           fragment: 'ignored',
    //         },
    //       },
    //       {
    //         label: 'Message',
    //         icon: 'pi pi-fw pi-comment',
    //         routerLink: ['/demo/uikit/message'],
    //       },
    //       {
    //         label: 'File',
    //         icon: 'pi pi-fw pi-file',
    //         routerLink: ['/demo/uikit/file'],
    //       },
    //       {
    //         label: 'Chart',
    //         icon: 'pi pi-fw pi-chart-bar',
    //         routerLink: ['/demo/uikit/charts'],
    //       },
    //       {
    //         label: 'Misc',
    //         icon: 'pi pi-fw pi-circle-off',
    //         routerLink: ['/demo/uikit/misc'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Prime Blocks',
    //     icon: 'pi pi-fw pi-prime',
    //     items: [
    //       {
    //         label: 'Free Blocks',
    //         icon: 'pi pi-fw pi-eye',
    //         routerLink: ['/demo/blocks'],
    //       },
    //       {
    //         label: 'All Blocks',
    //         icon: 'pi pi-fw pi-globe',
    //         url: ['https://www.primefaces.org/primeblocks-ng'],
    //         target: '_blank',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Utilities',
    //     icon: 'pi pi-fw pi-compass',
    //     items: [
    //       {
    //         label: 'PrimeIcons',
    //         icon: 'pi pi-fw pi-prime',
    //         routerLink: ['/demo/utilities/icons'],
    //       },
    //       {
    //         label: 'Colors',
    //         icon: 'pi pi-fw pi-palette',
    //         routerLink: ['/demo/utilities/colors'],
    //       },
    //       {
    //         label: 'PrimeFlex',
    //         icon: 'pi pi-fw pi-desktop',
    //         url: ['https://www.primefaces.org/primeflex/'],
    //         target: '_blank',
    //       },
    //       {
    //         label: 'Figma',
    //         icon: 'pi pi-fw pi-pencil',
    //         url: [
    //           'https://www.figma.com/file/zQOW0XBXdCTqODzEOqwBtt/Preview-%7C-Apollo-2022?node-id=335%3A21768&t=urYI89V3PLNAZEJG-1/',
    //         ],
    //         target: '_blank',
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Pages',
    //     icon: 'pi pi-fw pi-briefcase',
    //     items: [
    //       {
    //         label: 'Landing',
    //         icon: 'pi pi-fw pi-globe',
    //         routerLink: ['/demo/landing'],
    //       },
    //       {
    //         label: 'Auth',
    //         icon: 'pi pi-fw pi-user',
    //         items: [
    //           {
    //             label: 'Login',
    //             icon: 'pi pi-fw pi-sign-in',
    //             routerLink: ['/demo/auth/login'],
    //           },
    //           {
    //             label: 'Error',
    //             icon: 'pi pi-fw pi-times-circle',
    //             routerLink: ['/demo/auth/error'],
    //           },
    //           {
    //             label: 'Access Denied',
    //             icon: 'pi pi-fw pi-lock',
    //             routerLink: ['/demo/auth/access'],
    //           },
    //           {
    //             label: 'Register',
    //             icon: 'pi pi-fw pi-user-plus',
    //             routerLink: ['/demo/auth/register'],
    //           },
    //           {
    //             label: 'Forgot Password',
    //             icon: 'pi pi-fw pi-question',
    //             routerLink: ['/demo/auth/forgotpassword'],
    //           },
    //           {
    //             label: 'New Password',
    //             icon: 'pi pi-fw pi-cog',
    //             routerLink: ['/demo/auth/newpassword'],
    //           },
    //           {
    //             label: 'Verification',
    //             icon: 'pi pi-fw pi-envelope',
    //             routerLink: ['/demo/auth/verification'],
    //           },
    //           {
    //             label: 'Lock Screen',
    //             icon: 'pi pi-fw pi-eye-slash',
    //             routerLink: ['/demo/auth/lockscreen'],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Crud',
    //         icon: 'pi pi-fw pi-pencil',
    //         routerLink: ['/demo/pages/crud'],
    //       },
    //       {
    //         label: 'Timeline',
    //         icon: 'pi pi-fw pi-calendar',
    //         routerLink: ['/demo/pages/timeline'],
    //       },
    //       {
    //         label: 'Invoice',
    //         icon: 'pi pi-fw pi-dollar',
    //         routerLink: ['/demo/pages/invoice'],
    //       },
    //       {
    //         label: 'About Us',
    //         icon: 'pi pi-fw pi-user',
    //         routerLink: ['/demo/pages/aboutus'],
    //       },
    //       {
    //         label: 'Help',
    //         icon: 'pi pi-fw pi-question-circle',
    //         routerLink: ['/demo/pages/help'],
    //       },
    //       {
    //         label: 'Not Found',
    //         icon: 'pi pi-fw pi-exclamation-circle',
    //         routerLink: ['/demo/pages/notfound'],
    //       },
    //       {
    //         label: 'Empty',
    //         icon: 'pi pi-fw pi-circle-off',
    //         routerLink: ['/demo/pages/empty'],
    //       },
    //       {
    //         label: 'FAQ',
    //         icon: 'pi pi-fw pi-question',
    //         routerLink: ['/demo/pages/faq'],
    //       },
    //       {
    //         label: 'Contact Us',
    //         icon: 'pi pi-fw pi-phone',
    //         routerLink: ['/demo/pages/contact'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'E-Commerce',
    //     icon: 'pi pi-fw pi-wallet',
    //     items: [
    //       {
    //         label: 'Product Overview',
    //         icon: 'pi pi-fw pi-image',
    //         routerLink: ['/demo/ecommerce/product-overview'],
    //       },
    //       {
    //         label: 'Product List',
    //         icon: 'pi pi-fw pi-list',
    //         routerLink: ['/demo/ecommerce/product-list'],
    //       },
    //       {
    //         label: 'New Product',
    //         icon: 'pi pi-fw pi-plus',
    //         routerLink: ['/demo/ecommerce/new-product'],
    //       },
    //       {
    //         label: 'Shopping Cart',
    //         icon: 'pi pi-fw pi-shopping-cart',
    //         routerLink: ['/demo/ecommerce/shopping-cart'],
    //       },
    //       {
    //         label: 'Checkout Form',
    //         icon: 'pi pi-fw pi-check-square',
    //         routerLink: ['/demo/ecommerce/checkout-form'],
    //       },
    //       {
    //         label: 'Order History',
    //         icon: 'pi pi-fw pi-history',
    //         routerLink: ['/demo/ecommerce/order-history'],
    //       },
    //       {
    //         label: 'Order Summary',
    //         icon: 'pi pi-fw pi-file',
    //         routerLink: ['/demo/ecommerce/order-summary'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'User Management',
    //     icon: 'pi pi-fw pi-user',
    //     items: [
    //       {
    //         label: 'List',
    //         icon: 'pi pi-fw pi-list',
    //         routerLink: ['/demo/profile/list'],
    //       },
    //       {
    //         label: 'Create',
    //         icon: 'pi pi-fw pi-plus',
    //         routerLink: ['/demo/profile/create'],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Hierarchy',
    //     icon: 'pi pi-fw pi-align-left',
    //     items: [
    //       {
    //         label: 'Submenu 1',
    //         icon: 'pi pi-fw pi-align-left',
    //         items: [
    //           {
    //             label: 'Submenu 1.1',
    //             icon: 'pi pi-fw pi-align-left',
    //             items: [
    //               {
    //                 label: 'Submenu 1.1.1',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //               {
    //                 label: 'Submenu 1.1.2',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //               {
    //                 label: 'Submenu 1.1.3',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //             ],
    //           },
    //           {
    //             label: 'Submenu 1.2',
    //             icon: 'pi pi-fw pi-align-left',
    //             items: [
    //               {
    //                 label: 'Submenu 1.2.1',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //       {
    //         label: 'Submenu 2',
    //         icon: 'pi pi-fw pi-align-left',
    //         items: [
    //           {
    //             label: 'Submenu 2.1',
    //             icon: 'pi pi-fw pi-align-left',
    //             items: [
    //               {
    //                 label: 'Submenu 2.1.1',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //               {
    //                 label: 'Submenu 2.1.2',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //             ],
    //           },
    //           {
    //             label: 'Submenu 2.2',
    //             icon: 'pi pi-fw pi-align-left',
    //             items: [
    //               {
    //                 label: 'Submenu 2.2.1',
    //                 icon: 'pi pi-fw pi-align-left',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     label: 'Start',
    //     icon: 'pi pi-fw pi-download',
    //     items: [
    //       {
    //         label: 'Buy Now',
    //         icon: 'pi pi-fw pi-shopping-cart',
    //         url: ['https://www.primefaces.org/store'],
    //       },
    //       {
    //         label: 'Documentation',
    //         icon: 'pi pi-fw pi-info-circle',
    //         routerLink: ['/demo/documentation'],
    //       },
    //     ],
    //   },
    // ];
  }
}
