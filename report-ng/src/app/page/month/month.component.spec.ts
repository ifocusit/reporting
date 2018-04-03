import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import * as moment from 'moment';

import {MonthComponent} from './month.component';
import {MomentPipe} from '../../pipe/moment/moment.pipe';
import {DurationPipe} from '../../pipe/moment/duration.pipe';
import {ActivatedRoute, Params} from '@angular/router';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivityClient} from '../../client/activity-client.service';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {Activity, ActivityType} from "../../model/Activity.model";

describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  beforeEach(async(() => {
    moment.locale('fr');

    TestBed.configureTestingModule({
      declarations: [MonthComponent, MomentPipe, DurationPipe],
      imports: [
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatMenuModule,
        MatToolbarModule,
        MatIconModule,
        MatTableModule,
        MatInputModule,
        MatCardModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: Params) => void) => fn({
                month: '2018-03'
              })
            }
          }
        },
        {
          provide: ActivityClient,
          useValue: {
            getActivities$: (month: string) => Observable.of([]),
            saveActivity$: () => Observable.of('saved !')
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have month to start of month', () => {
    expect(component.month.date()).toEqual(1);
  });

  it('should show month/year name', () => {
    expect(select(fixture, '#month').textContent).toContain('mars 2018');
  });

  it('should show all day of the current month', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#times mat-row').length).toEqual(31);

    component.month = moment('2018-02-10', 'YYYY-MM-DD');
    fixture.detectChanges();
    expect(compiled.querySelectorAll('#times mat-row').length).toEqual(28);
  });

  it('should show header columns', () => {
    const header = select(fixture, '#times mat-header-row');
    expect(header.children[0].textContent).toEqual('Date');
    expect(header.children[2].textContent).toEqual('Total journalier');
  });

  it('should show day work duration', () => {
    assertLine(select(fixture, '#times mat-row', 1), '01 jeudi', 'PT8H', '08.00');
  });

  it('should update decimal duration', inject([ActivityClient], (activityClient: ActivityClient) => {
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelectorAll('#times mat-row input')[14];

    inputElement.value = 'PT9H15M';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    assertLine(select(fixture, '#times mat-row', 15), '15 jeudi', 'PT9H15M', '09.25');
  }));

  it('should hide weekend duration by default', () => {
    assertLine(select(fixture, '#times mat-row', 3), '03 samedi', null, null);
    assertLine(select(fixture, '#times mat-row', 4), '04 dimanche', null, null);
  });

  it('should should number of work days', () => {
    expect(select(fixture, '#workDays').textContent).toContain('22');
  });

  it('should should total of work durations', () => {
    expect(select(fixture, '#total').textContent).toContain('176.00');
    component.items[0].duration = 'PT10H';
    component.items[1].duration = 'PT10H';
    fixture.detectChanges();
    expect(select(fixture, '#total').textContent).toContain('180.00');
  });

  it('should load times from backend', inject([ActivityClient], (activityClient: ActivityClient) => {

    // given
    const client = spyOn(activityClient, 'getActivities$').and.returnValue(Observable
      .of([
        new Activity('2018-04-02', null, ActivityType.OFF),
        new Activity('2018-04-03', 'PT9H', ActivityType.WORK),
        new Activity('2018-04-04', null, ActivityType.OFF),
        new Activity('2018-04-05', 'PT7H30M', ActivityType.WORK)
      ]));

    // when
    component.month = moment('2018-04-01', 'YYYY-MM-DD');
    fixture.detectChanges();

    // then
    expect(client).toHaveBeenCalledWith('2018-04');
    assertLine(select(fixture, '#times mat-row', 1), '01 dimanche', null, null);
    assertLine(select(fixture, '#times mat-row', 2), '02 lundi', null, null);
    assertLine(select(fixture, '#times mat-row', 3), '03 mardi', 'PT9H', '09.00');
    assertLine(select(fixture, '#times mat-row', 4), '04 mercredi', null, null);
    assertLine(select(fixture, '#times mat-row', 5), '05 jeudi', 'PT7H30M', '07.50');
    expect(select(fixture, '#total').textContent).toContain('152.50');

  }));

  it('should save time from input text to backend', inject([ActivityClient], (activityClient: ActivityClient) => {
    // given
    const client = spyOn(activityClient, 'saveActivity$').and.returnValue(Observable.of('saved'));
    const inputElement: HTMLInputElement = fixture.nativeElement.querySelectorAll('#times mat-row input')[14];
    inputElement.value = 'PT9H15M';
    inputElement.dispatchEvent(new Event('input'));

    // when
    inputElement.dispatchEvent(new Event('focusout'));
    fixture.detectChanges();

    // then
    assertLine(select(fixture, '#times mat-row', 15), '15 jeudi', 'PT9H15M', '09.25');
    expect(client).toHaveBeenCalled();
    expect(client).toHaveBeenCalledWith('2018-03-15', 'PT9H15M', ActivityType.WORK);

  }));

  it('should show overtime', inject([ActivityClient], (activityClient: ActivityClient) => {
    // given
    spyOn(activityClient, 'getActivities$').and.returnValue(Observable.of(
      [
        {"date": "2018-04-02", "duration": null, "type": "OFF"},
        {"date": "2018-04-03", "duration": "PT9H", "type": "WORK"},
        {"date": "2018-04-04", "duration": "PT9H", "type": "WORK"},
        {"date": "2018-04-05", "duration": "PT9H", "type": "WORK"},
        {"date": "2018-04-06", "duration": "PT9H", "type": "WORK"},
        {"date": "2018-04-09", "duration": "PT9H", "type": "WORK"}
      ]
    ));

    // when
    component.month = moment('2018-04-01', 'YYYY-MM-DD');
    fixture.detectChanges();

    // then
    expect(select(fixture, '#overtime').textContent).toContain('5.00')
  }));

  it('should show final total with overtime majoration', inject([ActivityClient], (activityClient: ActivityClient) => {
    // given
    spyOn(activityClient, 'getActivities$').and.returnValue(Observable.of(
      [
        {"date": "2018-04-02", "duration": null, "type": "OFF"},
        {"date": "2018-04-03", "duration": "PT7H30M", "type": "WORK"},
        {"date": "2018-04-04", "duration": "PT8H30M", "type": "WORK"},
        {"date": "2018-04-05", "duration": "PT9H", "type": "WORK"},
        {"date": "2018-04-06", "duration": "PT9H30M", "type": "WORK"},
        {"date": "2018-04-09", "duration": "PT9H", "type": "WORK"}
      ]
    ));

    // when
    component.month = moment('2018-04-01', 'YYYY-MM-DD');
    fixture.detectChanges();

    // then
    expect(select(fixture, '#total').textContent).toContain('163.50')
    expect(select(fixture, '#overtime').textContent).toContain('3.50')
    expect(select(fixture, '#finalTotal').textContent).toContain('164.20')
  }));
});

// ************************************************************
// HELPERS
// ************************************************************

function select(fixture: ComponentFixture<MonthComponent>, selectors: string, index = 1): HTMLElement {
  const elements = fixture.debugElement.nativeElement.querySelectorAll(selectors);
  return elements[--index];
}

function assertLine(line: HTMLElement, date: string, duration = 'PT8H', decimal = '08.00') {
  expect(line.children[0].textContent).toEqual(date);
  if (duration) {
    expect(line.children[1].querySelector('input').getAttribute('ng-reflect-model')).toEqual(duration);
  } else {
    expect(line.children[1].querySelector('input').getAttribute('ng-reflect-model')).not.toBeTruthy();
  }
  if (decimal) {
    expect(line.children[2].textContent).toEqual(decimal);
  } else {
    expect(line.children[2].textContent).not.toBeTruthy();
  }
}
