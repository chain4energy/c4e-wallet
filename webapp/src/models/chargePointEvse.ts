export interface ChargePointEvse {
  id: number;
  chargePointId: number;
  deviceId: number;
  name?: string;
  status?: ChargePointEvseStatusType;
  errorCode?: string;
  active: boolean;
  url: string;
  locationId?: number;
  qrCodeLink?: string;
}

export interface ChargePointConnectorStatusResponse {
  requestStatus: RequestStatusType;
  status: ChargePointEvseStatusType;
  errorCode: string;
}

export interface ChargePointEvseStatusResponse {
  deviceStatus: DeviceStatus;
  availabilityStatus: AvailabilityStatus;
}

export interface AvailabilityStatus {
  available: boolean;
  sessionStatus: SessionStatus;
}

export interface DeviceStatus{
  status: ChargePointEvseStatusType;
}

export enum SessionStatus{
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  INVALID = "INVALID",
  PENDING = "PENDING",
  RESERVATION = "RESERVATION"
}

export enum RequestStatusType{
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  NOTIMPLEMENTED = 'NotImplemented'
}
export enum ChargePointEvseStatusType{
  AVAILABLE = 'AVAILABLE',
  BLOCKED = 'BLOCKED',
  CHARGING = 'CHARGING',
  INOPERATIVE = 'INOPERATIVE',
  OUTOFORDER = 'OUTOFORDER',
  PLANNED = 'PLANNED',
  REMOVED = 'REMOVED',
  RESERVED = 'RESERVED',
  UNKNOWN = 'UNKNOWN'
}
