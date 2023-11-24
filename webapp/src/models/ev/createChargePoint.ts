export interface CreateChargePoint {
  id: string;
  accountId?: number;
  chargePointDictId?: number;
  name: string;
  identificationCode: string;
  codeType: string;
  integrationType: string;
  integrationVersion?: string;
  addressId?: number;
  locationId?: number;
  tariffGroupId?: number;
  authRequired: boolean;
}
