import {DurationPipe} from './duration.pipe';
import * as moment from 'moment';

describe('DurationPipe', () => {

  const pipe = new DurationPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('call Duration format value with arg', () => {
    expect(pipe.transform(moment.duration('18:15'))).toEqual('18:15');
    expect(pipe.transform(moment.duration('8:1'))).toEqual('08:01');
  });

  it('manage null date', () => {
    expect(pipe.transform(null)).toEqual('');
  });
});
