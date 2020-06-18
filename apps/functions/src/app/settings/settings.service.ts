import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase-admin';

export enum ExportMonthType {
  FULL_DETAILS,
  TOTAL_DAYS_IN_COLUMN
}

export interface Settings {
  project: {
    name: string;
    theme?: string;
    monthExportType?: ExportMonthType;
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

@Injectable()
export class SettingsService {
  public settings(user: string, project: string): Promise<Settings> {
    return firebase
      .firestore()
      .doc(`users/${user}/projects/${project}`)
      .get()
      .then(doc => doc.data() as Settings);
  }
}
