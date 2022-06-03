import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {usePoolsStore} from "@/store/pools.store";
import {Pool} from "@/models/pool";

export default class PoolsService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.POOLS_SERVICE;
  }

  //TODO: MS: move to global configuration service
  COMMUNITY_POOL =  'https://lcd.chain4energy.org/cosmos/distribution/v1beta1/community_pool';
  STRATEGIC_RESERVE_POOL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1hcfjejmxzl8d95xka5j8cjegmf32u2lee3q422/by_denom?denom=uc4e';
  AIRDROP_POOL = 'https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1dutmadwfernuzmzk8ndtfah254yhrnv34y68ts/by_denom?denom=uc4e';

  public getDataToStore() {
    this.getDataFromUrl(this.COMMUNITY_POOL, true, null, this.setCommunityData ,null);
    this.getDataFromUrl(this.STRATEGIC_RESERVE_POOL, true, null, this.setStrategicReversePool, null);
    this.getDataFromUrl(this.AIRDROP_POOL, true, null, this.setAirdropPool, null);
  }

  setCommunityData(data: {pool: [Pool]} ) :void{
    usePoolsStore().setCommunityPool(data.pool[0]);
  }
  setStrategicReversePool(data: { balance: Pool }) :void{
    usePoolsStore().setStrategicReversePool(data.balance);
  }
  setAirdropPool(data: { balance: Pool }) :void{
    usePoolsStore().setAirdropPool(data.balance);
  }
}
