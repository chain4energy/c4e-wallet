export interface ChargePointConnector {
  id: number;
  chargePointId?: string;
  identifier: number;
  name?: string;
  status?: ChargePointConnectorStatusType;
  errorCode?: string;
  active: boolean;
  url?: string;
}

export interface ChargePointConnectorStatusResponse {
  requestStatus: RequestStatusType;
  status: ChargePointConnectorStatusType;
  errorCode: string;
}

export enum RequestStatusType{
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  NOTIMPLEMENTED = 'NotImplemented'
}
export enum ChargePointConnectorStatusType{
  DISCONNECTED = 'Disconnected',
  AVAILABLE = 'Available',
  PREPARING = 'Preparing',
  CHARGING = 'Charging',
  SUSPENDEDEVSE = 'SuspendedEVSE',
  SUSPENDEDEV = 'SuspendedEV',
  FINISHING = 'Finishing',
  RESERVED = 'Reserved',
  UNAVAILABLE = 'Unavailable',
  FAULTED = 'Faulted'

}