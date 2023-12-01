export interface ChargePointConnector {
  id: number;
  chargePointId?: string;
  identifier: number;
  status?: string;
  errorCode?: string;
  active: boolean;
  name?: string;
  qrCodeLink?: string;
}
