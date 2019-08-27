export interface Settings {
  project: {
    name: string;
    theme?: string;
  };
  timbrage: {
    defaults: string[];
    dailyReport: number; // h par j
    saveMissings: boolean;
    exportFormat: string;
  };
  bill: {
    hourlyRate: number; // taux horaire
    currency: string;
    tvaRate: number;
    logo?: string;
    correspondant?: string;
    society?: string;
    tvaNumber?: string;
    account?: {
      number: string;
      iban: string;
    };
    billBottomInfos?: string[];
  };
}

export const DEFAULT_SETTINGS: Settings = {
  project: {
    name: 'Default',
    theme: 'default-theme'
  },
  timbrage: {
    defaults: ['08:00', '11:30', '12:30', '17:00'],
    dailyReport: 8,
    saveMissings: true,
    exportFormat: 'YYYY-MM-DD HH:mm'
  },
  bill: {
    hourlyRate: 1,
    currency: 'CHF',
    tvaRate: 7.7
  }
};
