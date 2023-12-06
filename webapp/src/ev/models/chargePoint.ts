import {ChargePointConnector, ChargePointConnectorStatusType} from "@/ev/models/chargePointConnector";
import {TariffGroup} from "@/ev/models/tariffGroup";

export interface ChargePoint{
  id: string;
  accountId?: number;
  chargePointDictId?: number;
  name: string;
  identificationCode: string;
  codeType: string;
  integrationType: string;
  integrationVersion?: string;
  tariffGroupId?: number;
  authRequired: boolean;
  active: boolean;
  status: ChargePointStatusType; //sprawdzic statusy dla charger pointa
  errorCode?: string;
  addressId?: number;
  locationId?: number;
  chargePointConnectors?: ChargePointConnector[];
  tariffGroup:TariffGroup;
  url:string;
}

export enum ChargePointStatusType{
  AVAILABLE= 'AVAILABLE',
  PREPARING='PREPARING'
}
