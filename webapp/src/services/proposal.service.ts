import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useProposalStore} from "@/store/proposal.store";
import {PagingModel} from "@/services/model/paging.model";

export default class ProposalService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_SERVICE;
  }

  //TODO: MS: move to global configuration service, change URL to
  // https://lcd.chain4energy.org/cosmos/gov/v1beta1/proposals

  URL =  'https://api.data.kava.io/cosmos/gov/v1beta1/proposals';

  public getDataToStore(paginationKey?: string) {
    const pagination:any = {};
    if(paginationKey)
      pagination['pagination.key'] = paginationKey;

    pagination['pagination.limit'] = 10;
    this.getDataFromUrl(this.URL,true, null, this.setProposals ,null, pagination);
  }

  public async getProposalById(id: string): Promise<any> {

    return this.axiosCall<any>({
      method: 'GET',
      url: this.URL+"/"+id
    }, true, null).then(value => {
      if (value.error === null) {
        if (value.data!.data !== null) {
          return value.data;
        }
      }
    }).finally(() => {
      //
    });
  }

  setProposals(data: any ) :void{
    useProposalStore().setProposals(data.proposals, data.pagination.next_key);
  }

}
