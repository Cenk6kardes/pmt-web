import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuService } from 'src/app/layout/app.menu.service';

@Component({
  selector: 'description-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, CommonModule],
  styles: [
    `
      :host ::ng-deep {
        .p-dialog-title {
          margin: auto;
          color: #3b82f6;
        }
      }
      #description {
        overflow-wrap: break-word;
        white-space: normal;
        word-break: break-word;
        font-size: 1.15rem;
      }
    `
  ],
  template: `
    <ng-container *ngIf="description"
      ><button
        pButton
        pRipple
        icon="pi pi-info"
        class="p-element p-ripple p-button-rounded p-button-secondary p-component p-button-icon-only  mr-3 mb-3 border-round-3xl fixed bottom-0 right-0 shadow-7"
        (click)="showDialog()"
      ></button>
      <p-dialog
        [header]="header + ' Yardım' | titlecase"
        [(visible)]="visible"
        [modal]="true"
        [breakpoints]="{ '1199px': '75vw', '575px': '90vw' }"
        [style]="{ width: '60vw' }"
        [draggable]="false"
        [resizable]="false"
      >
        <p id="description" [innerHTML]="description"></p> </p-dialog
    ></ng-container>
  `
})
export class DescriptionDialogComponent {
  header: string = '';

  description = '';
  visible = false;
  constructor(private menuService: MenuService) {
    this.menuService.description$.subscribe((description) => {
      this.description = description;      
    });
    this.menuService.header$.subscribe((header) => {
      this.header = header;      
    });
  }

  showDialog() {
    this.visible = !this.visible;
  }
}
