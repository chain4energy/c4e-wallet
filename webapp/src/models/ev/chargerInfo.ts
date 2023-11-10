export interface ChargerInfo{
  location:string;
  name:string;
  connectorType:ConnectorType;
  availability:string;
  status:  ChargerStatus
}

export enum ConnectorType{
  TYPE1,
  TYPE2,
}

export enum ChargerStatus{
  AVAILABLE,
  UNAVAILABLE,
  BUSY
}

export interface PriceInfo{
  pricePerKwh: string
}
