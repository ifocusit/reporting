import { ElementRef, Injectable } from '@angular/core';
import { Moment } from 'moment';
import { map, toArray, take } from 'rxjs/operators';
import { Time, TimeAdapter } from '../models/time.model';
import { SettingsService } from './settings.service';
import { TimesService } from './times.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private settings: SettingsService, private timesService: TimesService) {}

  public exportMonth(date: Moment, exportLink: ElementRef) {
    const month = date.format('YYYY-MM');
    this.timesService
      .read(month)
      .pipe(
        take(1),
        map(times => {
          let csvContent = '';
          times.forEach(time => (csvContent += `${new TimeAdapter(time).format(this.settings.get().exportFormat)}\r\n`));
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
