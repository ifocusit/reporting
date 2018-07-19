import {MomentPipe} from './moment.pipe';
import * as moment from 'moment';

describe('MomentPipe', () => {

  const pipe = new MomentPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('call Moment format value with arg', () => {
    const date = moment('2018-03', 'YYYY-MM');
    date.format = jasmine.createSpy('format() mock').and.callFake(() => 'formatted time');
    expect(pipe.transform(date, 'MMMM YYYY')).toEqual('formatted time');
    expect(date.format).toHaveBeenCalledWith('MMMM YYYY');
  });

  it('manage null time', () => {
    expect(pipe.transform(null)).toEqual('');
  });
});
