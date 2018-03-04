import {async, ComponentFixture, TestBed} from '@angular/core/testing';
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

  it('should hide weekend duration by default', () => {
    assertLine(select(fixture, '#times mat-row', 3), '03 samedi', null, null);
    assertLine(select(fixture, '#times mat-row', 4), '04 dimanche', null, null);
  });

  it('should should number of work days', () => {
    expect(select(fixture, '#workDays').textContent).toEqual('22 jours ouvrés');
  });

  it('should should total of work durations', () => {
    expect(select(fixture, '#total').textContent).toEqual('total 176.00');
    component.items[0].duration = 'PT10H';
    component.items[1].duration = 'PT10H';
    fixture.detectChanges();
    expect(select(fixture, '#total').textContent).toEqual('total 180.00');
  });
});

// ************************************************************
// HELPERS
// ************************************************************

function select(fixture: ComponentFixture<MonthComponent>, selectors: string, number = 1): HTMLElement {
  const elements = fixture.debugElement.nativeElement.querySelectorAll(selectors);
  return elements[--number];
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
