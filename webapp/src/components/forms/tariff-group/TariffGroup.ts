export interface TariffGroup {
  dso: string;
  tariff: string;
  name: string;
  startDate: Date;
  endDate: Date;
  fees: {feeId: number, price:number}[];
}
