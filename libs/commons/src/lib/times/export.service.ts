import { ElementRef, Injectable } from '@angular/core';
import { Time } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import { range } from 'lodash';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import { ExportMonthType } from '../settings';
import { DurationPipe } from './../pipes/duration.pipe';
import { DATETIME_ISO_FORMAT, TimeAdapter } from './time.model';
import { TimesService } from './times.service';
import { WorkingDateReporting } from './working-date-reporting.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private timesService: TimesService, private store: Store) {}

  private createLinesForEachTimeReports(times: Time[]): string[] {
    return times.map(time => new TimeAdapter(time).format(DATETIME_ISO_FORMAT));
  }

  private createColumnsForEachDay(date: Moment, times: Time[]): string[] {
    const dailyReports = range(date.daysInMonth())
      .map(index => new WorkingDateReporting(date.clone().date(index + 1)))
      .map(
        day =>
          new WorkingDateReporting(
            day.date,
            times.filter(time => day.isSameDate(new TimeAdapter(time).getDay()))
          )
      );
    return [
      dailyReports.map(day => day.date.format('DD dd')).join(','), // first line: days of the month
      dailyReports.map(day => DurationPipe.format(day.duration, '')).join(',') // second line: total by days
    ];
  }

  public exportMonth(date: Moment, exportLink: ElementRef, exportType: ExportMonthType = ExportMonthType.TOTAL_DAYS_IN_COLUMN) {
    const month = date.format('YYYY-MM');
    this.timesService
      .read(month, 'month')
      .pipe(
        take(1),
        map(times => {
          switch (exportType) {
            case ExportMonthType.FULL_DETAILS:
              return this.createLinesForEachTimeReports(times);
            case ExportMonthType.TOTAL_DAYS_IN_COLUMN:
            default:
              return this.createColumnsForEachDay(date, times);
          }
        }),
        mergeMap(times => this.export(month, times, exportLink))
      )
      .subscribe();
  }

  public export(fileName: string, lines: string[], exportLink: ElementRef): Observable<any> {
    return of(lines).pipe(
      map(data => {
        let csvContent = '';
        data.forEach(time => (csvContent += `${time}\r\n`));
        return csvContent;
      }),
      tap(csvContent => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = exportLink.nativeElement;
        link.href = url;
        link.download = `${fileName}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
    );
  }
}
