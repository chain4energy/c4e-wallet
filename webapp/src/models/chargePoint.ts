import {ChargePointEvse} from "@/models/chargePointEvse";
import {TariffGroup} from "@/models/tariffGroup";

export interface ChargePoint{
  id: number;
  externalId: number;
  accountId?: number;
  chargePointDictId?: number;
  name: string;
  // identificationCode: string;
  // codeType: string;
  integrationType: string;
  integrationVersion?: string;
  tariffGroupId?: number;
  authRequired: boolean;
  active: boolean;
  status: ChargePointStatusType; //sprawdzic statusy dla charger pointa
  errorCode?: string;
  addressId?: number;
  locationId?: number;
  chargePointEvses?: ChargePointEvse[];
  tariffGroup:TariffGroup;
  url:string;
}

export enum ChargePointStatusType{
  AVAILABLE= 'AVAILABLE',
  PREPARING='PREPARING',
  UNKNOWN='UNKNOWN',
  Created='Created'
}
