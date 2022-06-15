import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useTokenomicsStore} from "@/store/tokenomics.store";

export default class TokenomicsService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENOMICS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  URL =  'https://hasura-testnet.chain4energy.org/v1/graphql';


  public getDataToStore() {
    this.axiosCall({
      method: 'POST',
      url: this.URL,
      data: {
        query: "query Tokenomics { stakingPool: staking_pool(order_by: {height: desc}, limit: 1) { bonded: bonded_tokens unbonded: not_bonded_tokens } } ",
      }
    }, true, null).then(value => {
      if (value.error === null) {
        this.setTokenomics(value.data);

      }
    });
  }

  setTokenomics(data: any) :void{
    useTokenomicsStore().setTokenomics(data.data.stakingPool[0]);
  }

}
