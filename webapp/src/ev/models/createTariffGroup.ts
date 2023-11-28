export interface CreateTariffGroup {
  name: string;
  accountId?: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}
