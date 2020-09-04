export enum ExportMonthType {
  FULL_DETAILS,
  TOTAL_DAYS_IN_COLUMN
}

export interface Settings {
  project: {
    name: string;
    theme?: string;
    monthExportType?: ExportMonthType;
    holidays?: {
      country: string;
      region?: string;
    };
  };
  timbrage: {
    defaults: string[];
    dailyReport: number; // h par j
    overtimeRate: number;
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
    overtimeRate: 1.2,
    saveMissings: true,
    exportFormat: 'YYYY-MM-DD HH:mm'
  },
  bill: {
    hourlyRate: 50,
    currency: 'CHF',
    tvaRate: 7.7
  }
};
