import { ElementRef, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { map, take, mergeMap, tap } from 'rxjs/operators';
import { TimeAdapter, DATETIME_ISO_FORMAT } from './time.model';
import { TimesService } from './times.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private timesService: TimesService) {}

  public exportMonth(date: Moment, exportLink: ElementRef) {
    const month = date.format('YYYY-MM');
    this.timesService
      .read(month)
      .pipe(
        take(1),
        map(times => times.map(time => new TimeAdapter(time).format(DATETIME_ISO_FORMAT))),
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
