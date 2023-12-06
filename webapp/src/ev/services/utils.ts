import {setAuthTokens} from "axios-jwt";
import {useEvCommonStore} from "@/ev/store/evCommon.store";

export function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

export function getChargePointUrlFromChargerPointConnectorUrl(chargePointConnectorUrl:string){
  console.log("chargePointConnectorUrl:" + chargePointConnectorUrl)
  const split = chargePointConnectorUrl.split("/");
  const retValue= split.slice(0,  -2).join("/");
  console.log("retValue:" + retValue);
  return retValue;
}

export function getChargePointConnectorUrlFromChargerPointConnectorSessionUrl(chargePointConnectorSessionUrl:string){
  console.log("chargePointConnectorSessionUrl:" + chargePointConnectorSessionUrl)
  const split = chargePointConnectorSessionUrl.split("/");
  const retValue= split.slice(0,  -2).join("/");
  console.log("retValue:" + retValue);
  return retValue;
}

export function setTokens(accessToken:string, refreshToken:string){
  useEvCommonStore().loggedIn = true;
  setAuthTokens({
    accessToken,
    refreshToken
  });
}
