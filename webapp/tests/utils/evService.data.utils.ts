import {DecodedLinkParamsType, DecodedLinkType, DecodeLinkAuthParams, LinkDecoder} from "@/models/evServiceCommons";

export function createLinkDecodeResponse() {
  const retValue : LinkDecoder<DecodeLinkAuthParams> = {
    type:DecodedLinkType.RESOURCE_LINK,
    version: '1',
    params: {
      type:DecodedLinkParamsType.CHARGE_POINT_CONNECTOR,
      resourceCode: 'asdasd',
      path:'sdfsd'
    }
  }
  return retValue;
}
