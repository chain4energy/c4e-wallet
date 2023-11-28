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
  status: ChargerStatus;
  active: boolean;
  chargePointId: string;
  identifier: number;
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
