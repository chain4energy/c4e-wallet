export interface ChargePointDict {
  id: number;
  name: string;
  description?: string;
  codeType: string;
  integrationType: string;
  integrationVersion?: string;
  plugType: string;
  currentPhases: number;
  maxChargingPower: number;
  numberOfConnectors: number;
  authRequired: boolean;
}
