export interface App {
  cap: number;
  createdOn: number;
  healthy: boolean;
  id: string;
  live: boolean;
  modifiedOn: number;
  name: string;
  nameSpace: string;
  partnerId: number;
  phone: string;
  stopped: boolean;
}

export interface AppLink {
  callbackUrl?: string;
  cap: number;
  createdOn: number;
  customerId: string;
  healthy: boolean;
  id: string;
  live: boolean;
  modifiedOn: number;
  name: string;
  partnerId: number;
  phone: string;
  stopped: boolean;
  walletId?: string;
}

export interface AppUsage {
  appId: string;
  appName: string;
  bic: number;
  date: string;
  fep: number;
  ftc: number;
  gsFees: number;
  incomingMsg: number;
  outgoingMediaMsgSKU: number;
  outgoingMsg: number;
  templateMediaMsgSKU: number;
  templateMsg: number;
  totalFees: number;
  totalMsg: number;
  uic: number;
  waFees: number;
}

export interface AppDailyDiscount {
  appId: string;
  cumulativeBill: number;
  dailyBill: number;
  day: number;
  discount: number;
  gsCap: number;
  gsFees: number;
  month: number;
  partnerId: number;
  year: number;
}
