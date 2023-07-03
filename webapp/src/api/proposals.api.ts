import {ServiceTypeEnum} from "@/services/logger/service-type.enum";
import { RequestResponse } from "@/models/request-response";
import BaseApi, { BlockchainPagination } from "@/api/base.api";
import {Proposal, ProposalDetailsTally, ProposalTallyResult, TallyParams, VoteOption} from "@/models/store/proposal";
import { ErrorData } from "@/api/base.api";
import {
  ProposalsResponse,
  ProposalResponse,
  GovernanceParameters,
  TallyResponse,
  ProposalsDetailsTallyResult
} from "@/models/blockchain/proposals";
import {
  mapDepositParams,
  mapProposalByID,
  mapProposals,
  mapProposalVoteResponse,
  mapProposalTallyResult,
  mapTallyParams,
  mapProposalsDetailsTallyResponse, mapProposalsDetailsTallyListResponse
} from "@/models/mapper/proposals.mapper";
import { useConfigurationStore } from "@/store/configuration.store";
import { Coin } from "@/models/store/common";
import queries from "./queries";
import { formatString } from "@/utils/string-formatter";
import { ProposalVoteResponse } from "@/models/hasura/proposal.vote";
import { BlockchainApiErrorData } from "@/models/blockchain/common";
import { HasuraErrorData } from "@/models/hasura/error";

export class ProposalsApi extends BaseApi {

  getServiceType(): ServiceTypeEnum {
    return ServiceTypeEnum.PROPOSAL_API;
  }

  // private PROPOSALS_URL = useConfigurationStore().config.queries.PROPOSALS_URL;
  // private PROPOSALS_BY_ID_URL = useConfigurationStore().config.queries.PROPOSALS_BY_ID_URL;

  // private TALLYING_URL = useConfigurationStore().config.queries.TALLYING_URL;
  // private DEPOSIT_URL = useConfigurationStore().config.queries.DEPOSIT_URL;
  // private PROPOSAL_TALLY_URL = useConfigurationStore().config.queries.PROPOSAL_TALLY_URL;


  public async fetchProposals(paginationKey: string | null, lockscreen: boolean): Promise<{ response: RequestResponse<{ proposals: Proposal[], numberOfActive: number}, ErrorData<BlockchainApiErrorData>>, nextKey: string | null }> {
    const mapData = (bcData: ProposalsResponse | undefined) => {return mapProposals(bcData?.proposals);};
    const pagination = new BlockchainPagination(paginationKey ? paginationKey : undefined, useConfigurationStore().config.proposalsPageLimit, true);
    const result = await this.axiosGetBlockchainApiPaginatedCall(useConfigurationStore().config.queries.PROPOSALS_URL,
    pagination, mapData, lockscreen, null, 'fetchAllProposals - ');
    return result;
  }
  public async fetchProposalById(id: number, lockscreen: boolean): Promise<RequestResponse<{ proposal: Proposal}, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (bcData: ProposalResponse | undefined) => {return mapProposalByID(bcData?.proposal);};

    const result = await this.axiosGetBlockchainApiCall(formatString(useConfigurationStore().config.queries.PROPOSALS_BY_ID_URL, {id: id}),
      mapData, lockscreen, null, 'fetchAllProposals - ');
    return result;
  }

  public async fetchTallyParams(lockscreen: boolean): Promise<RequestResponse<TallyParams, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (govParams: GovernanceParameters | undefined) => {return mapTallyParams(govParams);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.TALLYING_URL,
      mapData, lockscreen, null, 'fetchTallyParams - ');
    return result;
  }

  public async fetchDepositParams(lockscreen: boolean): Promise<RequestResponse<Coin, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (govParams: GovernanceParameters | undefined) => {return mapDepositParams(govParams);};

    const result = await this.axiosGetBlockchainApiCall(useConfigurationStore().config.queries.DEPOSIT_URL,
      mapData, lockscreen, null, 'fetchDepositParams - ');
    return result;
  }

  public async fetchVotingProposalTallyResult(id: number, lockscreen: boolean): Promise<RequestResponse<ProposalTallyResult, ErrorData<BlockchainApiErrorData>>> {
    const mapData = (tally: TallyResponse | undefined) => {return mapProposalTallyResult(tally?.tally);};

    const result = await this.axiosGetBlockchainApiCall(formatString(useConfigurationStore().config.queries.PROPOSAL_TALLY_URL, {id: id}),
      mapData, lockscreen, null, 'fetchVotingProposalTallyResult - ');
    return result;
  }

  public async fetchProposalVote(id: number, voter: string, lockscreen: boolean): Promise<RequestResponse<VoteOption | null, ErrorData<HasuraErrorData>>> {
    const mapData = (hasureData: ProposalVoteResponse | undefined) => {
        return mapProposalVoteResponse(hasureData);
    };
    return this.axiosHasuraCall(formatString(queries.hasura.PROPOSAL_USER_VOTE_QUERY, {proposalId: id, voter: voter}), mapData, lockscreen, null, 'fetchProposalVote - ');
  }

  public async fetchProposalsDetailsTally(id: number, lockscreen: boolean): Promise<RequestResponse<ProposalDetailsTally | null, ErrorData<HasuraErrorData>>> {
    const mapData = (hasureData: ProposalsDetailsTallyResult | undefined) => {
      return mapProposalsDetailsTallyResponse(hasureData);
    };
    return this.axiosHasuraCall(formatString(queries.hasura.PROPOSALS_DETAILS_TALLY_QUERY, {proposalId: id}), mapData, lockscreen, null, 'fetchProposalsDetailsTally - ');
  }

  public async fetchProposalsDetailsTallyList(ids: number[], lockscreen: boolean): Promise<RequestResponse<Map<number, ProposalDetailsTally> | null, ErrorData<HasuraErrorData>>> {
    const mapData = (hasureData: ProposalsDetailsTallyResult | undefined) => {
      return mapProposalsDetailsTallyListResponse(hasureData);
    };
    return this.axiosHasuraCall(formatString(queries.hasura.PROPOSALS_DETAILS_TALLY_LIST_QUERY, {proposalsIds: ids}), mapData, lockscreen, null, 'fetchProposalsDetailsTallyList - ');
  }
}
