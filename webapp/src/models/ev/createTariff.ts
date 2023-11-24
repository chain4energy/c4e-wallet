export interface CreateTariff {
  name: string;
  accountId?: number;
  currency: string;
  unit: string;
  unitCost: number; // Assuming decimal.Dec can be represented as number
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
