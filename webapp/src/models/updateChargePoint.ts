export interface UpdateChargePoint {
  accountId?: number;
  chargePointDictId?: number;
  name: string;
  integrationType: string;
  integrationVersion?: string;
  addressId?: number;
  locationId?: number;
  tariffGroupId?: number;
  authRequired?: boolean;
  chargingPointOperatorRoleId?: number;
  deviceId?: string;
  externalId?: string | number;
}
