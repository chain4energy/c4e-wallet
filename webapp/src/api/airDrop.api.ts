import BaseApi, {ErrorData} from "@/api/base.api";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import {BlockchainApiErrorData} from "@/models/blockchain/common";
import {AirDropRes, airDrop} from "@/models/airdrop/airdrop";
import axios from "axios";

import {mapCoin} from "@/models/mapper/common.mapper";
import {mapAirDrop} from "@/models/mapper/airDrop.mapper";
import {Block} from "@/models/store/block";
import {AirdropStore} from "@/models/store/airdrop";

export class AirDropApi extends BaseApi {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AIR_DROP_API;
  }

  public async fetchAirdropCosmos(address: string, lockscreen: boolean):  Promise<RequestResponse<airDrop, ErrorData<BlockchainApiErrorData>>>{
      const mapData = (bcData: airDrop | undefined) => {return mapAirDrop(bcData);};
      return  await this.axiosAirDropCall(address,
        mapData, lockscreen, null, 'fetchTotalSupply - ', undefined, undefined, true);
    }
}
