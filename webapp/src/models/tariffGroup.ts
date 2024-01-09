import {Tariff} from "@/models/tariff";

export interface TariffGroup {
  id: number;
  name: string;
  accountId?: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  tariffs: Tariff[];
  url: string;
}
