export interface LoginAuthRequest {
  resourceCode: string;
}

export interface AuthResponse {
  path: string;
  resourceCode: string;
}

export interface BaseServiceApplicationError{

}

export interface EvServiceApplicationError extends BaseServiceApplicationError{
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

export interface LinkDecoderDto<T> {
  type: string,
  version: string,
  params: T
}

export interface StartChargingAnonumousResponse {
}

export interface StartChargingAnonumousRequest {
  login: string;
}

export interface InitPaymentRequest{
  "amount": string,
  "currency": string
}

export interface DecodeLinkAuthParams {
  path: string;
  resourceCode: string;
}

export interface QrCodeInfoParams {
  path: string;
}
