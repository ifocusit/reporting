import { DEFAULT_DAY_DURATION, DEFAULT_TIME } from './working-date-reporting.model';
import { ISO_TIME } from './time.model';

export interface Settings {
  projectName: string;
  timbrage: {
    defaults: string[];
    dailyReport: number; // h par j
  };
  bill?: {
    hourlyRate: number; // taux horaire
    currency: string;
    tvaRate: number;
    logo?: string;
    clientInfos?: string[];
    tvaNumber: string;
    account: {
      number: string;
      iban: string;
    };
    billBottomInfos?: string[];
  };
}

export const DEFAULT_SETTINGS: Settings = {
  projectName: 'Default',
  timbrage: {
    dailyReport: DEFAULT_DAY_DURATION,
    defaults: DEFAULT_TIME.times.map(time => time.getMoment().format(ISO_TIME))
  }
};
