interface UpdateTariff {
  name: string;
  accountId?: number;
  deviceId: string;
  currency: string;
  unit: string;
  unitCost: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
