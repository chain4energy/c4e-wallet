export interface UpdateTariffGroup {
  name: string;
  accountId?: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
