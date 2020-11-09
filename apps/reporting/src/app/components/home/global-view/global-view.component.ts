import { AfterViewInit, Component } from '@angular/core';
import { asHours, BillService, MONTH_ISO_FORMAT, round } from '@ifocusit/commons';
import * as Highcharts from 'highcharts';
import range from 'lodash/range';
import * as moment from 'moment';
import { from, of } from 'rxjs';
import { filter, mergeMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'ifocusit-global-view',
  templateUrl: './global-view.component.html',
  styleUrls: ['./global-view.component.scss']
})
export class GlobalViewComponent implements AfterViewInit {
  private months: string[] = range(4, 12).map(month => moment().month(month).format(MONTH_ISO_FORMAT));

  private options: Highcharts.Options = {
    title: {
      text: 'Evolution de la facturation'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories: this.months,
      tickmarkPlacement: 'on'
    },
    series: [
      {
        name: 'Heures demandées',
        type: 'area',
        visible: false
      },
      {
        name: 'Heures reportées',
        type: 'area',
        visible: false
      },
      {
        name: 'Montant facturé',
        type: 'area'
      }
    ]
  };

  private dataHeuresDemandees = this.months.map(() => 0);
  private dataHeuresReportees = this.months.map(() => 0);
  private dataMontantFacture = this.months.map(() => 0);

  chart: Highcharts.Chart;

  constructor(private billService: BillService) {}

  ngAfterViewInit() {}

  load() {
    this.chart = Highcharts.chart('charts', this.options);
    from(this.months)
      .pipe(mergeMap(month => this.readMonth(month)))
      .subscribe();
  }

  private readMonth(month: string) {
    return of(month).pipe(
      take(1),
      mergeMap(() =>
        this.billService.getBill$(month).pipe(
          take(1),
          filter(bill => bill.archived && !!bill.detail),
          tap(bill => {
            const monthIndex = this.months.indexOf(month);
            const timeWorkDuration = moment.duration(bill.detail.timeWorkDuration);

            this.dataHeuresDemandees[monthIndex] = asHours(moment.duration(bill.detail.mustWorkDuration));
            this.dataHeuresReportees[monthIndex] = asHours(timeWorkDuration);
            this.dataMontantFacture[monthIndex] = round(asHours(timeWorkDuration) * bill.detail.hourlyRate);

            this.chart.series[0].setData(this.dataHeuresDemandees, false);
            this.chart.series[1].setData(this.dataHeuresReportees, false);
            this.chart.series[2].setData(this.dataMontantFacture, false);
          })
        )
      ),
      tap(() => this.chart.redraw())
    );
  }

  addMonth() {
    const oldestMonth = moment(this.months[0]);
    const month = oldestMonth.subtract(1, 'month').format(MONTH_ISO_FORMAT);
    this.loadMonth(month);
  }

  private loadMonth(month: string) {
    this.months.splice(0, 0, month);
    this.dataHeuresDemandees.splice(0, 0, 0);
    this.dataHeuresReportees.splice(0, 0, 0);
    this.dataMontantFacture.splice(0, 0, 0);
    this.chart.series[0].setData(this.dataHeuresDemandees, false);
    this.chart.series[1].setData(this.dataHeuresReportees, false);
    this.chart.series[2].setData(this.dataMontantFacture, false);
    this.chart.redraw();
    this.readMonth(month).subscribe();
  }

  addYear() {
    const oldestMonth = moment(this.months[0]);
    const start = oldestMonth.subtract(1, 'month');
    range(start.get('month'), -1, -1).forEach(month => this.loadMonth(start.clone().month(month).format(MONTH_ISO_FORMAT)));
  }
}
