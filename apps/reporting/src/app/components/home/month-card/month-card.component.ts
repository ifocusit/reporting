import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Bill, BillService, Settings, SettingsState } from '@ifocusit/commons';
import { Select } from '@ngxs/store';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { MonthProgression, ResumeMonthService } from '../../../services/resume-month.service';

@Component({
  selector: 'ifocusit-month-card',
  templateUrl: './month-card.component.html',
  styleUrls: ['./month-card.component.scss'],
  animations: [
    trigger('showPdfIcon', [transition(':enter', [style({ transform: 'scale(0)' }), animate('500ms', style({ transform: 'scale(1)' }))])]),
    trigger('showHours', [transition(':enter', [style({ opacity: 0 }), animate('500ms', style({ opacity: 1 }))])]),
    trigger('showProgressBar', [transition(':enter', [style({ width: 0 }), animate('500ms', style({ width: '100%' }))])]),
    trigger('showCard', [transition(':enter', [style({ transform: 'scale(0)' }), animate('500ms', style({ transform: 'scale(1)' }))])])
  ]
})
export class MonthCardComponent implements OnInit {
  @Input()
  month: string;

  @Select(SettingsState.settings)
  public settings$: Observable<Settings>;

  public today = moment().format('YYYY-MM');

  progression$: Observable<MonthProgression>;
  bill$: Observable<Bill>;

  constructor(private resumeMonthService: ResumeMonthService, private billService: BillService) {}

  ngOnInit(): void {
    this.bill$ = this.billService.getBill$(this.month);
    this.progression$ = this.resumeMonthService.resume$(this.month);
  }
}
