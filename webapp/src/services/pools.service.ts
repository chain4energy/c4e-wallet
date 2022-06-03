import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {LogLevel} from "@/services/logger/log-level";
import {usePoolsStore} from "@/store/pools.store";
import {Pool} from "@/models/pool";

export default class PoolsService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.POOLS_SERVICE;
  }

  public getData() {
    this.getDataFromUrl('https://lcd.chain4energy.org/cosmos/distribution/v1beta1/community_pool', this.setCommunityData);
    this.getDataFromUrl('https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1hcfjejmxzl8d95xka5j8cjegmf32u2lee3q422/by_denom?denom=uc4e',
      this.setStrategicReversePool)
    this.getDataFromUrl('https://lcd.chain4energy.org/cosmos/bank/v1beta1/balances/c4e1dutmadwfernuzmzk8ndtfah254yhrnv34y68ts/by_denom?denom=uc4e',
      this.setAirdropPool)
  }

  public getDataFromUrl(url: string, setData: (data:any) => void) {
    this.axiosCall<any>({
      method: 'GET',
      url: url
    }, true, null).then(value => {
      if (value.error === null) {
        if (value.data!.data !== null) {
          this.logToConsole(LogLevel.INFO, this.getServiceType() + JSON.stringify(value.data!.data, null, 2));
          setData(value.data!.data);
        } else {
          this.logToConsole(LogLevel.INFO, this.getServiceType() + ' are EMPTY');
        }
      } else {
        this.logToConsole(LogLevel.ERROR, this.getServiceType() + ' Response value error: ' + value.error + ' data:' + value.data?.data);
      }
    }).finally(() => {
      //
    });
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
