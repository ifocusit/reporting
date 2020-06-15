export interface BillDetail {
  nbWorkDays: number;
  mustWorkDuration: string;
  timeWorkDuration: string;
  overtimeCalculateDuration: string;
  percentProgression: number;
  hourlyRate: number;
  tvaRate: number;
  linesAmountHt: number;
  timesAmountHt: number;
}

export interface Bill {
  archived: boolean;
  billUrl?: string;
  detail?: BillDetail;
}

export const DEFAULT_BILL: Bill = {
  archived: false
};
