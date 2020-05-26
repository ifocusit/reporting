export interface Bill {
  archived: boolean;
  billUrl?: string;
}

export const DEFAULT_BILL: Bill = {
  archived: false
};
