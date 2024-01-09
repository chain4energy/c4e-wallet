import {Tariff} from "@/models/tariff";
import {TariffGroup} from "@/models/tariffGroup";

export interface CreateTariffForChargePoint {
  name: string;
  currency: string;
  unit: string;
  unitCost: string;
  accountId?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateTariffForChargePointResponse {
  tariff: Tariff;
  tariffGroup: TariffGroup;
}
