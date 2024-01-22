import {ChargePointEvses} from "@/models/chargePointEvses";
import {TariffGroup} from "@/models/tariffGroup";

export interface ChargePoint{
  id: number;
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
  chargePointEvses?: ChargePointEvses[];
  tariffGroup:TariffGroup;
  url:string;
}

export enum ChargePointStatusType{
  AVAILABLE= 'AVAILABLE',
  PREPARING='PREPARING'
}
