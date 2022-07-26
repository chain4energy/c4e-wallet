import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi, { BlockchainPagination } from "@/api/base.api";
import {Proposal } from "@/models/store/proposal";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { useToast } from "vue-toastification";
import { AccountResponse } from "@/models/blockchain/account";
import { mapAccount } from "@/models/mapper/account.mapper";
import { ProposalsResponse, ProposalResponse } from "@/models/blockchain/proposals";
import { mapAndAddProposals, mapProposalByID, mapProposals } from "@/models/mapper/proposals.mapper";
import { useConfigurationStore } from "@/store/configuration.store";
import { GovernanceParameters } from "@/models/GovernanceParameters";

const toast = useToast;


export class ProposalsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_API;
  }

  private PROPOSALS_URL = process.env.VUE_APP_PROPOSALS_URL;
  private TALLYING_URL = process.env.VUE_APP_TALLYING_URL

  //public async fetchProposals():Promise<RequestResponse<StoreProposals, ErrorData<BlockchainApiErrorData>>> {
    //let proposalsNotFound = false;
   // const mapData = (bcData: AccountResponse | undefined) => {
    //  return mapAccount(bcData?.account);
   // }
  //}
  public async fetchProposals(paginationKey: string | null): Promise<{ response: RequestResponse<{ proposals: Proposal[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>, nextKey: string | null }> {
    const mapData = (bcData: ProposalsResponse | undefined) => {return mapProposals(bcData?.proposals);};
    // const mapAndAddData = (data: { proposals: Proposal[], numberOfActive: number}, bcData: ProposalsResponse | undefined) => {return mapAndAddProposals(data.proposals, bcData?.proposals, data.numberOfActive);};
    const pagination = new BlockchainPagination(paginationKey ? paginationKey : undefined, 10, true); // TODO '10, true; - to config params
    const result = await this.axiosGetBlockchainApiPaginatedCall(useConfigurationStore().config.bcApiURL+this.PROPOSALS_URL,
    pagination, mapData, true, null, 'fetchAllProposals - ');
    return result;
  }
  public async fetchProposalById(id: number): Promise<RequestResponse<{ proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ProposalResponse | undefined) => {return mapProposalByID(bcData?.proposal);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.PROPOSALS_URL + `/${id}`,
      mapData, true, null, 'fetchAllProposals - ');
    return result;
  }

  //public async fetchProposals(paginationKey?: string): Promise<RequestResponse<Proposals, ErrorData<BlockchainApiErrorData>>> {
    //const pagination:any = {};
    //if(paginationKey)
   //  pagination['pagination.key'] = paginationKey;

    //pagination['pagination.limit'] = 10;
   // pagination['pagination.reverse'] = true;
    //return this.axiosBlockchainApiCall({
      //method: 'GET',
      //url: this.PROPOSALS_URL,
      //params: pagination
    //}, true, null);
  //}
  //public async fetchProposalById(id: string): Promise<RequestResponse<{proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
   // return this.axiosBlockchainApiCall({
     // method: 'GET',
     // url: this.PROPOSALS_URL+"/"+id
    //}, true, null);
  //}
  public async fetchTallyParams(): Promise<RequestResponse<GovernanceParameters, ErrorData<BlockchainApiErrorData>>> {
    return this.axiosBlockchainApiCall<GovernanceParameters>({
      method: 'GET',
      url: useConfigurationStore().config.bcApiURL+this.TALLYING_URL
    }, true, null);
  }
}
