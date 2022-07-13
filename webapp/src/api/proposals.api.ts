import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import {RequestResponse} from "@/models/request-response";
import BaseApi from "@/api/base.api";
import {Proposal, Proposals} from "@/models/Proposal";
import {GovernanceParameters} from "@/models/GovernanceParameters";
import {useConfigurationStore} from "@/store/configuration.store";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";


export class ProposalsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_SERVICE;
  }

  private PROPOSALS_URL = process.env.VUE_APP_PROPOSALS_URL;
  private TALLYING_URL = process.env.VUE_APP_TALLYING_URL

  public async fetchProposals(paginationKey?: string): Promise<RequestResponse<Proposals, ErrorData<BlockchainApiErrorData>>> {
    const pagination:any = {};
    if(paginationKey)
      pagination['pagination.key'] = paginationKey;

    pagination['pagination.limit'] = 10;
    pagination['pagination.reverse'] = true;
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.PROPOSALS_URL,
      params: pagination
    }, true, null);
  }
  public async fetchProposalById(id: string): Promise<RequestResponse<{proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall({
      method: 'GET',
      url: this.PROPOSALS_URL+"/"+id
    }, true, null);
  }
  public async fetchTallyParams(): Promise<RequestResponse<GovernanceParameters, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall<GovernanceParameters>({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.TALLYING_URL
    }, true, null);
  }
}
