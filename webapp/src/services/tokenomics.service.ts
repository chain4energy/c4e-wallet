import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useTokenomicsStore} from "@/store/tokenomics.store";

export default class TokenomicsService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOKENOMICS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  //URL =  'https://hasura-testnet.chain4energy.org/v1/graphql';
  URL = 'https://lcd.chain4energy.org/cosmos/staking/v1beta1/pool'

  public getDataToStore() {
    this.axiosCall({
      method: 'GET',
      url: this.URL
    }, true, null).then(value => {
      if (value.error === null) {
        this.setTokenomics(value.data);

      }
    });
  }

  setTokenomics(data: any) :void{
    useTokenomicsStore().setTokenomics(data.pool);
  }

}
