import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi, { BlockchainPagination } from "@/api/base.api";
import {Proposal, ProposalTallyResult, TallyParams } from "@/models/store/proposal";
import { ErrorData, BlockchainApiErrorData } from "@/api/base.api";
import { ProposalsResponse, ProposalResponse, GovernanceParameters, TallyResponse } from "@/models/blockchain/proposals";
import { mapDepositParams, mapProposalByID, mapProposals, mapProposalTallyResult, mapTallyParams } from "@/models/mapper/proposals.mapper";
import { useConfigurationStore } from "@/store/configuration.store";
import { Coin } from "@/models/store/common";
import queries from "./queries";
import { formatString } from "@/utils/string-formatter";

export class ProposalsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_API;
  }

  private PROPOSALS_URL = queries.blockchain.PROPOSALS_URL;
  private PROPOSALS_BY_ID_URL = queries.blockchain.PROPOSALS_BY_ID_URL;

  private TALLYING_URL = queries.blockchain.TALLYING_URL;
  private DEPOSIT_URL = queries.blockchain.DEPOSIT_URL;
  private PROPOSAL_TALLY_URL = queries.blockchain.PROPOSAL_TALLY_URL;


  public async fetchProposals(paginationKey: string | null, lockscreen: boolean): Promise<{ response: RequestResponse<{ proposals: Proposal[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>, nextKey: string | null }> {
    const mapData = (bcData: ProposalsResponse | undefined) => {return mapProposals(bcData?.proposals);};
    const pagination = new BlockchainPagination(paginationKey ? paginationKey : undefined, useConfigurationStore().config.proposalsPageLimit, true);
    const result = await this.axiosGetBlockchainApiPaginatedCall(useConfigurationStore().config.bcApiURL+this.PROPOSALS_URL,
    pagination, mapData, lockscreen, null, 'fetchAllProposals - ');
    return result;
  }
  public async fetchProposalById(id: number, lockscreen: boolean): Promise<RequestResponse<{ proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ProposalResponse | undefined) => {return mapProposalByID(bcData?.proposal);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+formatString(this.PROPOSALS_BY_ID_URL, {id: id}),
      mapData, lockscreen, null, 'fetchAllProposals - ');
    return result;
  }

  public async fetchTallyParams(lockscreen: boolean): Promise<RequestResponse<TallyParams, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (govParams: GovernanceParameters | undefined) => {return mapTallyParams(govParams);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.TALLYING_URL,
      mapData, lockscreen, null, 'fetchTallyParams - ');
    return result;
  }

  public async fetchDepositParams(lockscreen: boolean): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (govParams: GovernanceParameters | undefined) => {return mapDepositParams(govParams);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+this.DEPOSIT_URL,
      mapData, lockscreen, null, 'fetchDepositParams - ');
    return result;
  }

  public async fetchVotingProposalTallyResult(id: number, lockscreen: boolean): Promise<RequestResponse<ProposalTallyResult, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (tally: TallyResponse | undefined) => {return mapProposalTallyResult(tally?.tally);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.bcApiURL+formatString(this.PROPOSAL_TALLY_URL, {id: id}),
      mapData, lockscreen, null, 'fetchVotingProposalTallyResult - ');
    return result;
  }
}
