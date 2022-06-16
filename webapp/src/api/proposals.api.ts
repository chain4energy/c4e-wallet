import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {Proposal, Proposals} from "@/models/Proposal";
import {GovernanceParameters} from "@/models/GovernanceParameters";


export class ProposalsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_SERVICE;
  }

  //TODO: MS: move to global configuration service
  private PROPOSALS_URL = 'https://api.data.kava.io/cosmos/gov/v1beta1/proposals';
  private TALLYING_URL =  'https://lcd.chain4energy.org/cosmos/gov/v1beta1/params/tallying';

  public async fetchProposals(paginationKey?: string): Promise<RequestResponse<Proposals>> {
    const pagination:any = {};
    if(paginationKey)
      pagination['pagination.key'] = paginationKey;

    pagination['pagination.limit'] = 10;
    return this.axiosCall({
      method: 'GET',
      url: this.PROPOSALS_URL,
      params: pagination
    }, true, null);
  }
  public async fetchProposalById(id: string): Promise<RequestResponse<{proposal: Proposal}>> {
    return this.axiosCall({
      method: 'GET',
      url: this.PROPOSALS_URL+"/"+id
    }, true, null);
  }
  public async fetchTallyParams(): Promise<RequestResponse<GovernanceParameters>> {
    return this.axiosCall<GovernanceParameters>({
      method: 'GET',
      url: this.TALLYING_URL
    }, true, null);
  }
}
