import { Component } from '@angular/core';
import { AlertService } from 'src/app/core/services/alert.service';
import { CoreApiService } from 'src/app/core/services/core-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  barOptions: any;
  pieOptions: any;

  widgets: any[] = [];
  blueShades: string[] = [
    '#e0f7fa',
    '#b2ebf2',
    '#80deea',
    '#4dd0e1',
    '#26c6da',
    '#00bcd4',
    '#00acc1',
    '#0097a7',
    '#00838f',
    '#006064',
    '#84ffff',
    '#18ffff',
    '#00e5ff',
    '#00b8d4',
    '#0091ea',
    '#82b1ff',
    '#448aff',
    '#2979ff',
    '#2962ff',
    '#01579b',
  ];

  constructor(
    private alertService: AlertService,
    private coreApiService: CoreApiService
  ) {}

  ngOnInit(): void {
    this.initCharts();
    this.getWidgetData();
  }

  getWidgetData() {
    this.coreApiService.getDashboardWidget().subscribe({
      next: (res: any) => {
        if (res?.data?.widgets?.length > 0) {
          for (let widget of res.data.widgets) {
            let widgetData: any = {};
            if (widget.widgetType === 'PieChart') {
              widgetData = this.mapPieData(
                widget.widgetData,
                widget.widgetType,
                widget.title
              );
            }
            if (widget.widgetType === 'BarChart') {
              widgetData = this.mapBarData(
                widget.widgetData,
                widget.widgetType,
                widget.title
              );
            }
            if (widget.widgetType === 'ListChart') {
              widgetData = { data: widget.widgetData, title: widget.title, widgetType: widget.widgetType };
            }
            this.widgets.push(widgetData);
          }
        }
      },
      error: (error) => {
        this.alertService.callMessage(
          'error',
          'İşlem Başarısız',
          'Veri yüklenemedi'
        );
      },
    });
  }

  initCharts() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: 700,
            },
          },
          position: 'bottom',
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            beginAtZero: false,
            min: 1,
            max: 3,
            stepSize: 1,
            callback: function (value: any, index: any, values: any) {
              if (value !== 0) {
                return value;
              }
              return '';
            },
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };

    this.pieOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
            font: {
              weight: 700,
            },
            padding: 28,
          },
          position: 'bottom',
        },
      },
    };
  }

  mapPieData(widgetData: any, widgetType: any, title: any) {
    const sortedWidgetData = widgetData.sort((a: any, b: any) => {
      if (a.legend < b.legend) {
        return -1;
      }
      if (a.legend > b.legend) {
        return 1;
      }
      return 0;
    });
    const data = {
      labels: sortedWidgetData.map((item: any) => item.legend),
      datasets: [
        {
          data: sortedWidgetData.map((item: any) => item.data),
          backgroundColor: sortedWidgetData.map(
            (_: any, index: any) =>
              this.blueShades[index % this.blueShades.length]
          ),
          hoverBackgroundColor: sortedWidgetData.map(
            (_: any, index: any) =>
              this.blueShades[(index + 10) % this.blueShades.length]
          ),
        },
      ],
    };
    return { data, widgetType, title };
  }

  mapBarData(widgetData: any, widgetType: any, title: any) {
    const sortedWidgetData = widgetData.sort((a: any, b: any) => {
      if (a.series < b.series) {
        return -1;
      }
      if (a.series > b.series) {
        return 1;
      }
      return 0;
    });

    const isMultipleLegend = sortedWidgetData.every(
      (widget: any) => widget.legend === sortedWidgetData[0].legend
    );

    let data: any = {
      labels: sortedWidgetData.map((item: any) => item.series),
      datasets: [],
    };

    if (isMultipleLegend) {
      data.datasets = [
        {
          label: sortedWidgetData[0].legend,
          data: sortedWidgetData.map((item: any) => item.data),
          backgroundColor: sortedWidgetData.map(
            (_: any, index: any) =>
              this.blueShades[index % this.blueShades.length]
          ),
          hoverBackgroundColor: sortedWidgetData.map(
            (_: any, index: any) =>
              this.blueShades[(index + 10) % this.blueShades.length]
          ),
        },
      ];
    } else {
      for (let item of sortedWidgetData) {
        data.datasets.push({
          label: item.legend,
          data: item.data,
          backgroundColor: sortedWidgetData.map(
            (_: any, index: any) =>
              this.blueShades[index % this.blueShades.length]
          ),
        });
      }
    }
    return { data, widgetType, title };
  }
}
