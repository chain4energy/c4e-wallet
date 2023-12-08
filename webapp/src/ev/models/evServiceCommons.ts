export interface LoginAuthRequest {
  resourceCode: string;
}

export interface AuthResponse {
  path: string;
  resourceCode: string;
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


export interface InitPaymentResponse{
  "paymentUrl": string,
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

