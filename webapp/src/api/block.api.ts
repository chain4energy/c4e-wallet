import { ServiceTypeEnum } from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi from "@/api/base.api";
import { useConfigurationStore } from "@/store/configuration.store";
import { ErrorData } from "@/api/base.api";
import { BlockResponse } from "@/models/blockchain/block";
import { mapBlock } from "@/models/mapper/block.mapper";
import { Block } from "@/models/store/block";
import { mapAverageBlockTime } from "@/models/mapper/average.block.time.mapper";
import { AverageBlockTimeResponse } from "@/models/hasura/average.block.time";
import queries from "./queries";
import { BlockchainApiErrorData } from "@/models/blockchain/common";
import { HasuraErrorData } from "@/models/hasura/error";

export class BlockApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.BLOCK_API;
  }

  private LATEST_BLOCK_URL = queries.blockchain.LATEST_BLOCK_URL;


  public async fetchLatestBlock(lockscreen: boolean): Promise<RequestResponse<Block, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: BlockResponse | undefined) => { return mapBlock(bcData); };
    return  await this.axiosGetBlockchainApiCall(this.LATEST_BLOCK_URL,
      mapData, lockscreen, null, 'fetchLatestBlock - ');
  }

  public async fetchAverageBlockTime(lockscreen: boolean): Promise<RequestResponse<number, ErrorData<HasuraErrorData>>> {
    const mapData = (hasureData: AverageBlockTimeResponse | undefined) => { return mapAverageBlockTime(hasureData); };
    return this.axiosHasuraCall(queries.hasura.AVERAGE_BLOCK_TIME_QUERY, mapData, lockscreen, null, 'fetchAverageBlockTime - ');
  }

}
