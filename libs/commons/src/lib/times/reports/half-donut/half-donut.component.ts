import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import range from 'lodash/range';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SettingsState } from '../../../settings/settings.store';
import { CalculationService } from '../../calculation.service';
import { TimesService } from '../../times.service';

@Component({
  selector: 'lib-half-donut',
  templateUrl: './half-donut.component.html',
  styleUrls: ['./half-donut.component.scss']
})
export class HalfDonutComponent implements OnInit {
  @Input()
  month: string;

  report$: Observable<any>;

  constructor(private store: Store, private timesService: TimesService, private calculationService: CalculationService) {}

  ngOnInit() {
    this.report$ = this.timesService.read(this.month, 'month').pipe(
      mergeMap(times =>
        this.calculationService.calculate(times).pipe(
          mergeMap(duration =>
            this.store.selectOnce(SettingsState.settings).pipe(
              map(settings => {
                const actual = Math.round(duration.asHours());
                const date = moment(this.month).startOf('month');
                const daysInMonth = range(moment(this.month).daysInMonth())
                  .map(index => date.clone().day(index + 1))
                  .filter(day => [1, 2, 3, 4, 5].indexOf(day.day()) > -1).length;

                const max = daysInMonth * settings.timbrage.dailyReport;
                const overtime = actual - max;
                const sum = max + (overtime > 0 ? overtime : 0);

                const report = {
                  actual,
                  max,
                  progress: Math.round((actual * 100) / max),
                  normal: overtime > 0 ? Math.round((max * 100) / actual) : Math.round((actual * 100) / max),
                  overtime: Math.round((overtime * 100) / sum)
                };
                return report;
              })
            )
          )
        )
      )
    );
  }
}
