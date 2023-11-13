export interface LoginAuthRequest {
  resourceCode: string;
}

export interface AuthResponse {
  path: string;
  resourceCode: string;
}

export interface EvServiceApplicationError {
  code: number,
  name: string,
  codespace: EvServiceApplicationErrorCodespace,
  message: string,
  data: Date,
  causeMessage: string,
  causeAppError: EvServiceApplicationError
}

export enum EvServiceApplicationErrorCodespace {
  API = 'api',
  AUTH = 'auth',
  CACHE = 'cache',
  ETH_CLIENT = 'eth-client',
  NOTIFIER = 'notifier',
  PAYMENT_GW = 'payment-gw',
  PERSISTENCE = 'persistence',
  SERVICE = 'service',
  SIGNATURE = 'signature'
}

export interface LinkDecoderDto {
  type: string,
  version: string,
  params: Map<string, string>
}

export interface StartChargingAnonumousResponse {}
export interface StartChargingAnonumousRequest {
  login: string;
}
