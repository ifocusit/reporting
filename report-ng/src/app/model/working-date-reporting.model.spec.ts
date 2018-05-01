import {CalculateDuration, DEFAULT_TIME, WorkingDateReporting} from "./working-date-reporting.model";
import * as moment from "moment";
import {Duration} from "moment";
import Matchers = jasmine.Matchers;

const date = '2018-04-24';
describe('WorkingDateReporting model', () => {

  it('should initialize times with by default times', () => {
    expect(new WorkingDateReporting(moment('2018-04-02')).withDefaultTimes().times)
      .toEqual(['2018-04-02T08:00', '2018-04-02T11:30', '2018-04-02T12:30', '2018-04-02T17:00']);

    expect(new WorkingDateReporting(moment('2018-04-01')).times).toBeUndefined();
  });

  it('should calculate duration', () => {
    expectDuration('08:00', '12:00').toEqual(moment.duration('PT4H'));
    expectDuration('08:00', '12:00', '13:00').toEqual(moment.duration('PT4H'));
  });

  it('should get duration', () => {
    expect(item('08:00').getDuration()).toBeNull();
    expect(item('08:00', '12:00').getDuration()).toEqual(moment.duration(4, 'hours'));
    expect(item('08:00', '12:00', '13:00').getDuration()).toEqual(moment.duration(4, 'hours'));
    expect(item('08:00', '12:00', '13:15', '18:30').getDuration()).toEqual(moment.duration('PT9H15M'));
  });

  it('should get morning duration', () => {
    expect(item('08:00').getMorningDuration()).toEqual(moment.duration());
    expect(item('08:00', '12:00').getMorningDuration()).toEqual(moment.duration('PT4H'));
    expect(item('08:00', '12:00', '13:00').getMorningDuration()).toEqual(moment.duration('PT4H'));
    expect(item('08:00', '12:00', '13:15', '18:30').getMorningDuration()).toEqual(moment.duration('PT4H'));
    expect(item('08:00', '09:00', '10:15', '11:30').getMorningDuration()).toEqual(moment.duration('PT2H15M'));
    expect(DEFAULT_TIME.getMorningDuration()).toEqual(moment.duration('PT3H30M'));
  });

  it('should get duration to string', () => {
    expect(item('08:00').duration).toEqual('');
    expect(item('08:00', '12:30').duration).toEqual('PT4H30M');
  });

  it('should inform if is weekend day', () => {
    expect(new WorkingDateReporting(moment('2018-04-01')).isWeekend()).toBe(true);
    expect(new WorkingDateReporting(moment('2018-04-02')).isWeekend()).toBe(false);
  });

  it('should check if same day as other', () => {
    expect(new WorkingDateReporting(moment('2018-04-01')).isSameDate('2018-04-01')).toBe(true);
    expect(new WorkingDateReporting(moment('2018-04-02')).isSameDate('2018-04-01')).toBe(false);
  });

  it('should set time base on an requested duration', () => {
    const report = item('08:00', '12:30');
    report.duration = 'PT9H30M';
    expect(report.times).toEqual(['2018-04-24T08:00', '2018-04-24T11:30', '2018-04-24T12:30', '2018-04-24T18:30']);

    report.duration = 'PT8H';
    expect(report.times).toEqual(['2018-04-24T08:00', '2018-04-24T11:30', '2018-04-24T12:30', '2018-04-24T17:00']);

    report.duration = 'PT6H45M';
    expect(report.times).toEqual(['2018-04-24T08:00', '2018-04-24T11:30', '2018-04-24T12:30', '2018-04-24T15:45']);

    report.duration = 'PT3H';
    expect(report.times).toEqual(['2018-04-24T08:00', '2018-04-24T11:00']);

    report.duration = 'PT3H15M';
    expect(report.times).toEqual(['2018-04-24T08:00', '2018-04-24T11:15']);
  });
});

function item(...times: string[]): WorkingDateReporting {
  return new WorkingDateReporting(moment(date), times.map(time => `${date}T${time}`));
}

function expectDuration(...times: string[]): Matchers<Duration> {
  return expect(CalculateDuration(times.map(time => `${date}T${time}`)));
}
