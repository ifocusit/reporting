export interface BillDetail {
  hourlyRate: number;
  tvaRate: number;
  nbWorkDays?: number;
  mustWorkDuration?: string;
  timeWorkDuration?: string;
  linesAmountHt?: number;
}

export interface Bill {
  month: string;
  archived: boolean;
  billUrl?: string;
  detail: BillDetail;
}
