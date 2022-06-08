import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useAverageBlockTime} from "@/store/average-block-time.store";

export default class AverageBlockTimeService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.AVERAGE_BLOCK_TIME;
  }

  //TODO: MS: move to global configuration service
  URL =  'https://hasura-testnet.chain4energy.org/v1/graphql';

  public getDataToStore() {
    this.axiosCall({
      method: 'POST',
      url: this.URL,
      data: {
        query: "query AverageBlockTime {\n" +
          "  averageBlockTime: average_block_time_per_hour(limit: 1, order_by: {height: desc}) {\n" +
          "    averageTime: average_time\n" +
          "  }\n" +
          "}",
      }
    }, true, null).then(value => {
      if (value.error === null) {
        this.setAverageBlockTime(value.data!.data);

      }
    });
  }

  setAverageBlockTime(data: any) :void{
    useAverageBlockTime().setAverageBlockTime(data.data.averageBlockTime[0].averageTime);
  }

}
