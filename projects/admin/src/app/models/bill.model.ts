export interface Bill {
  archived: boolean;
  billUrl?: string;
}

export interface BillLine {
  id?: string;
  label: string;
  amount?: number;
}

export const DEFAULT_BILL = {
  archived: false
} as Bill;
