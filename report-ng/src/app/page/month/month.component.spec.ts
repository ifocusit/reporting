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
    expect(compiled.querySelectorAll('#report li').length).toEqual(31);

    component.month = moment('2018-02-10', 'YYYY-MM-DD');
    fixture.detectChanges();
    expect(compiled.querySelectorAll('#report li').length).toEqual(28);
  });
});
