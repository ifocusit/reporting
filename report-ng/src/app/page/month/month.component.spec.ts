import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import * as moment from 'moment';

import {MonthComponent} from './month.component';
import {MomentPipe} from '../../pipe/moment/moment.pipe';
import {DurationPipe} from '../../pipe/moment/duration.pipe';

describe('MonthComponent', () => {
  let component: MonthComponent;
  let fixture: ComponentFixture<MonthComponent>;

  beforeEach(async(() => {
    moment.locale('fr');
    TestBed.configureTestingModule({
      declarations: [MonthComponent, MomentPipe, DurationPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthComponent);
    component = fixture.componentInstance;
    component.month = moment('2018-03-24', 'YYYY-MM-DD');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have month to start of month', () => {
    expect(component.month.date()).toEqual(1);
  });

  it('should show month/year name', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('mars 2018');
  });

  it('should show all day of the current month', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('#report li').length).toEqual(32);

    component.month = moment('2018-02-10', 'YYYY-MM-DD');
    fixture.detectChanges();
    expect(compiled.querySelectorAll('#report li').length).toEqual(29);
  });

  it('should show header columns', () => {
    const header = select(fixture, '#report li.header');
    expect(header.children.length).toEqual(2);
    expect(header.children[0].textContent).toEqual('date');
    expect(header.children[1].textContent).toEqual('total journalier');
  });

  it('should show day work duration', () => {
    const compiled = fixture.debugElement.nativeElement;
    assertLine(compiled.querySelectorAll('#report li:nth-child(2)')[0], 'jeudi 01', '', '08:00', '08.00');
  });

  it('should hide weekend duration by default', () => {
    assertLine(select(fixture, '#report li:nth-child(4)'), 'samedi 03', '', '', '');
    assertLine(select(fixture, '#report li:nth-child(5)'), 'dimanche 04', '', '', '');
  });

  it('should should number of work days', () => {
    expect(select(fixture, '#workDays').textContent).toEqual('22 jours ouvrés');
  });

  it('should should total of work durations', () => {
    expect(select(fixture, '#total').textContent).toEqual('total 176.00');
    component.items[0].duration = moment.duration('10:00');
    component.items[1].duration = moment.duration('10:00');
    fixture.detectChanges();
    expect(select(fixture, '#total').textContent).toEqual('total 180.00');
  });
});

// ************************************************************
// HELPERS
// ************************************************************

function select(fixture: ComponentFixture<MonthComponent>, selector: string): HTMLElement {
  const elements = fixture.debugElement.nativeElement.querySelectorAll(selector);
  expect(elements.length).toEqual(1); // `Element not found. CSS selector : '${selector}'`
  return elements[0];
}

function assertLine(line: HTMLElement, date: string, type = '', duration = '08:00', decimal = '08.00') {
  expect(line.children[0].textContent).toEqual(date);
  expect(line.children[1].textContent).toEqual(type);
  expect(line.children[2].textContent).toEqual(duration);
  expect(line.children[3].textContent).toEqual(decimal);
}
