import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";

import {useTallyingStore} from "@/store/tallying.store";

export default class TallyingService extends BaseService<any> {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.TALLYING_SERVICE;
  }

  URL =  'https://lcd.chain4energy.org/cosmos/gov/v1beta1/params/tallying';

  public getDataToStore() {
    this.getDataFromUrl(this.URL, true, null, this.setCommunityData ,null);
  }

  setCommunityData(data: any ) :void{
    useTallyingStore().setTallyParams(data.tally_params);
  }

}
