import { DEFAULT_DAY_DURATION } from './working-date-reporting.model';

export interface Settings {
  projectName: string;
  timbrage: {
    defaults: string[];
    dailyReport: number; // h par j
  };
  bill: {
    hourlyRate: number; // taux horaire
    currency: string;
    tvaRate: number;
    logo?: string;
    clientInfos?: string[];
    tvaNumber?: string;
    account?: {
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
    defaults: ['08:00', '11:30', '12:30', '17:00']
  },
  bill: {
    hourlyRate: 1,
    currency: 'CHF',
    tvaRate: 7.7
  }
};
