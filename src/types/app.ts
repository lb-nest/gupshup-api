export interface App {
  callbackUrl?: string;
  cap?: number;
  createdOn: number;
  customerId?: string;
  healthy: boolean;
  id: string;
  live: boolean;
  modifiedOn: number;
  name: string;
  partnerId: number;
  phone?: string;
  stopped: boolean;
  walletId?: string;
}
