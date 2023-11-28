import {ChargePointConnector} from "@/ev/models/chargePointConnector";
import {TariffGroup} from "@/ev/models/tariffGroup";

export interface ChargePoint{
  id: string;
  active: boolean;
  status: string;
  errorCode?: string;
  accountId?: number;
  chargePointDictId?: number;
  name: string;
  identificationCode: string;
  codeType: string;
  integrationType: string;
  integrationVersion?: string;
  addressId?: number;
  locationId?: number;
  tariffGroupId?: number;
  authRequired: boolean;
  chargePointConnectors?: ChargePointConnector[];
}
