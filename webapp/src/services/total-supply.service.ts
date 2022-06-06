import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {Pool} from "@/models/pool";
import {useTotalSupplyStore} from "@/store/total-supply.store";

export default class TotalSupplyService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TOTAL_SUPPLY_SERVICE;
  }

  //TODO: MS: move to global configuration service
  URL =  'https://lcd.chain4energy.org/cosmos/bank/v1beta1/supply/uc4e';


  public getDataToStore() {
    this.getDataFromUrl(this.URL, true, null, this.setTotalSupply ,null);
  }

  setTotalSupply(data: { amount: Pool } ) :void{
    useTotalSupplyStore().setTotalSupply(data.amount);
  }

}
