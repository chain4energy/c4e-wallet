import BaseService from "@/services/base.service";
import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {useProposalStore} from "@/store/proposal.store";

export default class ProposalService extends BaseService<any> {
  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_SERVICE;
  }

  //TODO: MS: move to global configuration service, change URL to
  // https://lcd.chain4energy.org/cosmos/gov/v1beta1/proposals?pagination.offset=0&pagination.limit=3&pagination.count_total=true

  URL =  'https://api.data.kava.io/cosmos/gov/v1beta1/proposals';

  public getDataToStore() {

    this.getDataFromUrl(this.URL,true, null, this.setProposals ,null);
  }

  public async getProposalById(id: string): Promise<any> {
    return this.axiosCall<any>({
      method: 'GET',
      url: this.URL+"/"+id
    }, true, null).then(value => {
      if (value.error === null) {
        if (value.data!.data !== null) {
          return value.data!.data.proposal;
        }
      }
    }).finally(() => {
      //
    });
  }

  setProposals(data: any ) :void{
    useProposalStore().setProposals(data.proposals);
  }

}
