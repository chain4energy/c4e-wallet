import {ChargePointConnectorStatusType} from "@/models/chargePointEvse";

export interface ChargerInfo {
  location: string;
  name: string;
  connectorType: ConnectorType;
  availability: string;
  status: ChargerStatus;
}

export interface ChargePointInfo {
  id: number;
  name: string;
  status: ChargePointConnectorStatusType;
  active: boolean;
  identificationCode: number;
  codeType: string;
  integrationType: string;
  integrationVersion: string;
  tariffGroupId: string;
  chargePointDictId: number;
  errorCode: string;
}

export enum ConnectorType {
  TYPE1,
  TYPE2,
}

export enum ChargerStatus {
  AVAILABLE= "Available",
  UNAVAILABLE = "Unavailable",
  BUSY = "Busy",
}

export interface PriceInfo {
  pricePerKwh: string
}
