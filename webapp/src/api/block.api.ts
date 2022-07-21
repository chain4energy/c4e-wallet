import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {LatestBlock} from "@/models/LatestBlock";
import { AverageBlockTimeResponse} from "@/models/AverageBlockTime";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";

export class BlockApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.BLOCK_API;
  }

  private LATEST_BLOCK_URL = process.env.VUE_APP_LATEST_BLOCK_URL;

  public async fetchLatestBlock(): Promise<RequestResponse<LatestBlock, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.LATEST_BLOCK_URL
    }, false, null);
  }

  public async fetchAverageBlockTime(): Promise<RequestResponse<AverageBlockTimeResponse, ErrorData<any>>> {
    return this.axiosHasuraCall( {
      method: 'POST',
      url: useConfigurationStore().config.hasuraURL,
      data: {
        query: "query AverageBlockTime {\n" +
          "  averageBlockTime: average_block_time_per_hour(limit: 1, order_by: {height: desc}) {\n" +
          "    averageTime: average_time\n" +
          "  }\n" +
          "}",
      }
    }, true, null);
  }

}
