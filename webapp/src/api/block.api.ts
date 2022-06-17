import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {LatestBlock} from "@/models/LatestBlock";
import { AverageBlockTimeResponse} from "@/models/AverageBlockTime";

export class BlockApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.BLOCK_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private LATEST_BLOCK_URL = 'https://lcd.chain4energy.org/cosmos/base/tendermint/v1beta1/blocks/latest';
  private AVERAGE_BLOCK_TIME_URL = 'https://hasura-testnet.chain4energy.org/v1/graphql';

  public async fetchLatestBlock(): Promise<RequestResponse<LatestBlock>> {
    return this.axiosCall({
      method: 'GET',
      url: this.LATEST_BLOCK_URL
    }, true, null);
  }

  public async fetchAverageBlockTime(): Promise<RequestResponse<AverageBlockTimeResponse>> {
    return this.axiosCall( {
      method: 'POST',
      url: this.AVERAGE_BLOCK_TIME_URL,
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
