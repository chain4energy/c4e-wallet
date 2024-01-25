export interface CreateChargePointFromDict {
  sourceChargePointDictId?: number;
  accountId?: number;
  externalId: string;
  name: string;
  identificationCode?: string;
  locationId?: number;
  tariffGroupId?: number;
}
