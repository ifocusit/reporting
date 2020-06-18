export interface BillDetail {
  nbWorkDays: number;
  mustWorkDuration: string;
  timeWorkDuration: string;
  hourlyRate: number;
  tvaRate: number;
  linesAmountHt: number;
}

export interface Bill {
  archived: boolean;
  billUrl?: string;
  detail?: BillDetail;
}

export const DEFAULT_BILL: Bill = {
  archived: false
};
