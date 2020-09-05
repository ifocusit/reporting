import { Injectable } from '@angular/core';
import { Time } from '@ifocusit/commons';
import { Store } from '@ngxs/store';
import { saveAs } from 'file-saver';
import range from 'lodash/range';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { map, mergeMap, take, tap } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { ExportMonthType } from '../settings';
import { DurationPipe } from './../pipes/duration.pipe';
import { DATETIME_ISO_FORMAT, TimeAdapter } from './time.model';
import { TimesService } from './times.service';
import { WorkingDateReporting } from './working-date-reporting.model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_TYPE = 'text/csv;charset=UTF-8;';
const CSV_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private timesService: TimesService, private store: Store) {}

  public exportMonth(date: Moment, exportType: ExportMonthType = ExportMonthType.TOTAL_DAYS_IN_COLUMN) {
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
        mergeMap(data => this.exportXlsx(month, data))
      )
      .subscribe();
  }

  private exportXlsx(month: string, rows: any[]): Observable<any> {
    return of(rows).pipe(
      map(data => {
        const worksheet = XLSX.utils.aoa_to_sheet(data, { dateNF: 'dd ddd', cellDates: true });

        const workbook: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, month);

        return XLSX.writeFile(workbook, month + EXCEL_EXTENSION, { bookType: 'xlsx', type: 'binary' });
      })
    );
  }

  private createLinesForEachTimeReports(times: Time[]): any[] {
    return [times.map(time => new TimeAdapter(time).format(DATETIME_ISO_FORMAT))];
  }

  private createColumnsForEachDay(date: Moment, times: Time[]): any[] {
    const days: WorkingDateReporting[] = range(date.daysInMonth())
      .map(index => new WorkingDateReporting(date.clone().day(index + 1)))
      .map(
        day =>
          new WorkingDateReporting(
            day.date,
            times.filter(time => day.isSameDate(new TimeAdapter(time).getDay()))
          )
      );
    return [
      // first row with days
      days.map(day => day.date.toDate()),
      // second row with durations
      days.map(day => DurationPipe.format(day.duration, ''))
    ];
  }

  public exportCsv(fileName: string, lines: string[]): Observable<any> {
    return of(lines).pipe(
      map(data => {
        let csvContent = '';
        data.forEach(time => (csvContent += `${time}\r\n`));
        return csvContent;
      }),
      tap(csvContent => {
        const blob = new Blob([csvContent], { type: CSV_TYPE });
        saveAs(blob, fileName + CSV_EXTENSION);
      })
    );
  }
}
