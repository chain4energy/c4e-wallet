import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useLatestBlockStore} from "@/store/latest-block.store";
import {PagingModel} from "@/services/model/paging.model";

export default class LatestBlockService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.LATEST_BLOCK_SERVICE;
  }

  //TODO: MS: move to global configuration service
  URL =  'https://lcd.chain4energy.org/cosmos/base/tendermint/v1beta1/blocks/latest';


  public getDataToStore() {

    this.getDataFromUrl(this.URL, true, null, this.setLatestBlock ,null);
  }

  setLatestBlock(data: any ) :void{
    console.log(data)
    useLatestBlockStore().setLatestBlock(data.block.header.height);
  }

}
