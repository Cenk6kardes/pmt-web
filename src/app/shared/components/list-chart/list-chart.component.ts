import { Component, Input, OnInit } from '@angular/core';
import { IListChartData } from '../../models/listChart.model';

@Component({
  selector: 'list-chart',
  template: `<div class="grid">
    <div class="col-12 py-6 px-6">
      <p-table #dt [value]="data" [columns]="cols" responsiveLayout="scroll" dataKey="id">
        <ng-template pTemplate="body" let-item>
          <tr>
            <td *ngFor="let col of cols">
              <span class="p-column-title">{{ col.header }}</span>
              <span>{{ item[col.field] }}</span>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>`
})
export class ListChartComponent implements OnInit {
  @Input() data: IListChartData[] = [];

  cols: { field: string; header: string }[] = [];

  ngOnInit(): void {
    if (this.data[0].series.length > 0) {
      this.cols.push({ field: 'series', header: '' });
    }
    if (this.data[0].legend.length > 0) {
      this.cols.push({ field: 'legend', header: '' });
    }
    if (this.data[0].data !== null) {
      this.cols.push({ field: 'data', header: '' });
    }
  }
}
