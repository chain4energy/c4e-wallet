export interface Tariff {
  id: number;
  tariffGroupId: number;
  name: string;
  accountId?: number;
  currency: string;
  unit: string;
  unitCost: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
