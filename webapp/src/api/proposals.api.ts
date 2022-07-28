import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi, { BlockchainPagination } from "@/api/base.api";
import {Proposal, TallyParams } from "@/models/store/proposal";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { useToast } from "vue-toastification";
import { AccountResponse } from "@/models/blockchain/account";
import { mapAccount } from "@/models/mapper/account.mapper";
import { ProposalsResponse, ProposalResponse, GovernanceParameters } from "@/models/blockchain/proposals";
import { mapAndAddProposals, mapProposalByID, mapProposals, mapTallyParams } from "@/models/mapper/proposals.mapper";
import { useConfigurationStore } from "@/store/configuration.store";

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
  public async fetchProposals(paginationKey: string | null, lockscreen: boolean): Promise<{ response: RequestResponse<{ proposals: Proposal[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>, nextKey: string | null }> {
    const mapData = (bcData: ProposalsResponse | undefined) => {return mapProposals(bcData?.proposals);};
    const pagination = new BlockchainPagination(paginationKey ? paginationKey : undefined, 10, true); // TODO '10, true; - to config params
    const result = await this.axiosGetBlockchainApiPaginatedCall(useConfigurationStore().config.bcApiURL+this.PROPOSALS_URL,
    pagination, mapData, lockscreen, null, 'fetchAllProposals - ');
    return result;
  }
  public async fetchProposalById(id: number, lockscreen: boolean): Promise<RequestResponse<{ proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ProposalResponse | undefined) => {return mapProposalByID(bcData?.proposal);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.PROPOSALS_URL + `/${id}`,
      mapData, lockscreen, null, 'fetchAllProposals - ');
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
  public async fetchTallyParams(lockscreen: boolean): Promise<RequestResponse<TallyParams, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (govParams: GovernanceParameters | undefined) => {return mapTallyParams(govParams);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.TALLYING_URL,
      mapData, lockscreen, null, 'fetchTallyParams - ');
    return result;
  }
}
