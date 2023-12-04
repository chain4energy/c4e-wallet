export interface LoginAuthRequest {
  resourceCode: string;
}

export interface AuthResponse {
  path: string;
  resourceCode: string;
}

// export interface BaseServiceApplicationError{
// //base interface
// }

export interface EvServiceApplicationError /* extends BaseServiceApplicationError */{
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


export enum DecodedLinkType{
  AUTH_RESOURCE_LINK ="auth-resource-link",
  RESOURCE_LINK = "resource-link"
}

export enum DecodedLinkParamsType{
  CHARGE_POINT_CONNECTOR = "charge-point-connector",
  CHARGING_SESSION = "charging-session"
}
export interface LinkDecoder<T> {
  type: DecodedLinkType,
  version: string,
  params: T
}

export interface StartChargingAnonumousResponse {
  rest:string
}

export interface StartChargingAnonumousRequest {
  login: string;
}

export interface InitPaymentRequest{
  "amount": string,
  "currency": string
}

export interface DecodedLinkParamsBase {
  path: string;
  type: DecodedLinkParamsType;
}

export interface DecodeLinkAuthParams extends DecodedLinkParamsBase{
  resourceCode: string;
}

export interface QrCodeInfoParams {
  path: string;
  type: string;
}


export enum EvServiceApplicationErrorName {

  AUTH_PASSWORD_TOO_SHORT = 'AUTH_PASSWORD_TOO_SHORT',
  AUTH_PASSWORD_NO_DIGIT = 'AUTH_PASSWORD_NO_DIGIT',
  AUTH_PASSWORD_NO_LETTER = 'AUTH_PASSWORD_NO_LETTER',
  AUTH_PASSWORD_NO_LOWERCASE = 'AUTH_PASSWORD_NO_LOWERCASE',
  AUTH_PASSWORD_NO_UPPERCASE = 'AUTH_PASSWORD_NO_UPPERCASE',
  AUTH_PASSWORD_NO_SPECIAL_CHAR = 'AUTH_PASSWORD_NO_SPECIAL_CHAR',
  SERVICE_LOGIN_FAILED = 'SERVICE_LOGIN_FAILED',
  SERVICE_ACCOUNT_ALREADY_EXISTS = 'SERVICE_ACCOUNT_ALREADY_EXISTS',
  SERVICE_ACCOUNT_INACTIVE = 'SERVICE_ACCOUNT_INACTIVE',
  SERVICE_ACCOUNT_ACTIVATION_TIME_EXPIRED = 'SERVICE_ACCOUNT_ACTIVATION_TIME_EXPIRED',
  SERVICE_ACCOUNT_PAIRING_TIME_EXPIRED = 'SERVICE_ACCOUNT_PAIRING_TIME_EXPIRED',

  PERSISTENCE_ERROR = 'PERSISTENCE_ERROR',
  PERSITENCE_RESOURCE_NOT_FOUND = 'PERSITENCE_RESOURCE_NOT_FOUND',
  PERSITENCE_RESOURCE_TOO_MANY = 'PERSITENCE_RESOURCE_TOO_MANY',
  PERSITENCE_COMMIT_ERROR = 'PERSITENCE_COMMIT_ERROR',
  PERSITENCE_ROLLBACK_ERROR = 'PERSITENCE_ROLLBACK_ERROR',
  PERSITENCE_FIND_ERROR = 'PERSITENCE_FIND_ERROR',
  PERSITENCE_CREATE_ERROR = 'PERSITENCE_CREATE_ERROR',
  PERSITENCE_UPDATE_ERROR = 'PERSITENCE_UPDATE_ERROR',
  PERSITENCE_AVAILABLE_TOKEN_POOL_EXCEEDED = 'PERSITENCE_AVAILABLE_TOKEN_POOL_EXCEEDED',
  PERSITENCE_ORDER_PUBLIC_SALE_ROUND_INACTIVE = 'PERSITENCE_ORDER_PUBLIC_SALE_ROUND_INACTIVE',
  PERSITENCE_ORDER_AMOUNT_NOT_POSITIVE = 'PERSITENCE_ORDER_AMOUNT_NOT_POSITIVE',
  PERSITENCE_ORDER_TX_CLOSED_ORDER = 'PERSITENCE_ORDER_TX_CLOSED_ORDER',
  PERSITENCE_ORDER_TX_NOT_UNIQUE_BLOCKHAIN_AND_TX_HASH = 'PERSITENCE_ORDER_TX_NOT_UNIQUE_BLOCKHAIN_AND_TX_HASH',
  PERSITENCE_USER_NOT_UNIQUE_KYC_SESSION_ID = 'PERSITENCE_USER_NOT_UNIQUE_KYC_SESSION_ID',
  PERSITENCE_USER_NOT_UNIQUE_CLAIM_ADDRESS = 'PERSITENCE_USER_NOT_UNIQUE_CLAIM_ADDRESS',
  PERSITENCE_USER_NOT_UNIQUE_EVM_ADDRESS = 'PERSITENCE_USER_NOT_UNIQUE_EVM_ADDRESS'

}
