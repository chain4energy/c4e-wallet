import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi from "@/api/base.api";
import { ErrorData } from "@/api/base.api";
import queries from "./queries";
import { KeybaseErrorData, PictureUrlResponse } from "@/models/keybase/keybase";
import { formatString } from "@/utils/string-formatter";

export class KeybaseApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.KEYBASE_API;
  }

  public async fetchPictureAddress(keybaseHash: string, lockscreen: boolean): Promise<RequestResponse<string | undefined, ErrorData<KeybaseErrorData>>> {
    const mapData = (kaybaseData: PictureUrlResponse | undefined): string | undefined => { 
      if (!kaybaseData?.list || kaybaseData.list.length < 1) {
        return undefined;
      }
      return kaybaseData.list[0].keybase?.picture_url
    };
    return this.axiosKeybaseCall(formatString(queries.keybase.QUERY_URL, {keybaseHash: keybaseHash}), mapData, lockscreen, null, 'fetchPictureAddress - ');
  }

}
