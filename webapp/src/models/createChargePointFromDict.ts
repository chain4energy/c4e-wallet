export interface CreateChargePointFromDict {
  sourceChargePointDictId?: number;
  accountId?: number;
  externalId?: string;
  deviceId: string;
  name: string;
  identificationCode?: string;
  locationId?: number;
  tariffGroupId?: number;
}
