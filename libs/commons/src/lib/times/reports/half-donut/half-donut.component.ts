import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { range } from 'lodash';
import moment from 'moment';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { map, mergeMap } from 'rxjs/operators';
import { SettingsState } from '../../../settings/settings.store';
import { CalculationService, asHours, round } from '../../calculation.service';
import { TimesService } from '../../times.service';

@Component({
  selector: 'lib-half-donut',
  templateUrl: './half-donut.component.html',
  styleUrls: ['./half-donut.component.scss'],
  imports: [CommonModule, FlexLayoutModule, TranslateModule],
  standalone: true
})
export class HalfDonutComponent {
  month = input<string>();

  report$ = this.timesService.read(this.month() || '', 'month').pipe(
    mergeMap(times =>
      this.calculationService.calculate(times).pipe(
        mergeMap(duration =>
          this.store.selectOnce(SettingsState.settings).pipe(
            map(settings => {
              const actual = asHours(duration);
              const date = moment(this.month()).startOf('month');
              const daysInMonth = range(moment(this.month()).daysInMonth())
                .map(index => date.clone().date(index + 1))
                .filter(day => [1, 2, 3, 4, 5].indexOf(day.day()) > -1).length;

              const max = daysInMonth * settings.timbrage.dailyReport;
              const overtime = actual - max;
              const sum = max + (overtime > 0 ? overtime : 0);

              const report = {
                actual,
                max,
                progress: round((actual * 100) / max),
                normal: overtime > 0 ? round((max * 100) / actual) : round((actual * 100) / max),
                overtime: round((overtime * 100) / sum)
              };
              return report;
            })
          )
        )
      )
    )
  );

  constructor(private store: Store, private timesService: TimesService, private calculationService: CalculationService) {}
}
