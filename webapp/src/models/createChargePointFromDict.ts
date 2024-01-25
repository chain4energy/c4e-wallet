export interface CreateChargePointFromDict {
  sourceChargePointDictId?: number;
  accountId?: number;
  id: string;
  name: string;
  identificationCode?: string;
  locationId?: number;
  tariffGroupId?: number;
}
