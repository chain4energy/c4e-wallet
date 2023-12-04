export function createLinkFromPathParams(params: string | string[]): string {
  if (Array.isArray(params)) {
    return params.join("/");
  } else {
    return params;
  }
}

export function getChargerPointUrlFromChargerPointConnectorUrl(chargePointConnectorUrl:string){
  console.log("chargePointConnectorUrl:" + chargePointConnectorUrl)
  const split = chargePointConnectorUrl.split("/");
  const retValue= split.slice(0,  -2).join("/");
  console.log("retValue:" + retValue);
  return retValue;
}
