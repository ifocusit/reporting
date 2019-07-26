import { ElementRef, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { map, take } from 'rxjs/operators';
import { TimeAdapter, DATETIME_ISO_FORMAT } from '../models/time.model';
import { TimesService } from './times.service';

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
        map(times => {
          let csvContent = '';
          times.forEach(time => (csvContent += `${new TimeAdapter(time).format(DATETIME_ISO_FORMAT)}\r\n`));
          return csvContent;
        })
      )
      .subscribe(csvContent => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = exportLink.nativeElement;
        link.href = url;
        link.download = `${month}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
