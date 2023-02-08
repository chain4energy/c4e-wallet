import {
  GovernanceParameters,
  Proposal as BcProposal,
  ProposalsDetailsTallyResult,
  Tally
} from "@/models/blockchain/proposals";
import { mapCoin } from "@/models/mapper/common.mapper";
import {
  Proposal as StoreProposal,
  ProposalContent,
  ProposalTallyResult,
  ProposalStatus,
  TallyParams,
  VoteOption, ProposalsPlan, ProposalsAmount, ProposalType, ProposalsChanges, ProposalDetailsTally,
} from "@/models/store/proposal";
import { Coin } from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { ProposalVoteResponse } from "../hasura/proposal.vote";
import {mapStakingPool} from "@/models/mapper/tokens.mapper";

export function mapProposals(proposals: BcProposal[] | undefined): { proposals: StoreProposal[], numberOfActive: number }  {
  if (proposals === undefined) {
    throw new Error('Proposals list is undefined');
  }
  const result = Array<StoreProposal>();
  const active = mapAndAddProposalsToArray(result, proposals);

  return { proposals: result, numberOfActive: active};
}
export function mapProposalByID(proposal: BcProposal | undefined): { proposal: StoreProposal}  {
  if (proposal === undefined) {
    throw new Error('Proposal is undefined');
  }
  const result = mapProposal(proposal);

  return { proposal: result};
}

export function mapAndAddProposals(proposalsDst: StoreProposal[], bcProposals: BcProposal[] | undefined, numberOfActive: number): { proposals: StoreProposal[], numberOfActive: number}  {
  if (bcProposals === undefined) {
    throw new Error('BcProposal list is undefined');
  }
  const active = numberOfActive + mapAndAddProposalsToArray(proposalsDst, bcProposals);
  return { proposals: proposalsDst, numberOfActive: active};
}
function mapAndAddProposalsToArray(array: StoreProposal[], bcValidators: BcProposal[]): number  {
  let active = 0;
  bcValidators.forEach(proposal => {
    const mapped = mapProposal(proposal);
    array.push(mapped);
    if (mapped.status === ProposalStatus.PASSED) {
      active++;
    }
  });
  return active;
}
export function mapProposalTallyResult(tally?: Tally): ProposalTallyResult {
  if (tally === undefined) {
    throw new Error('mapProposalTallyResult -tally is undefined');
  }
  if (tally.yes === undefined ||
      tally.no === undefined ||
      tally.abstain === undefined ||
      tally.no_with_veto === undefined) {
    throw new Error('mapProposalTallyResult - some of tally votes is undefined');
  }
  return new ProposalTallyResult(
    BigInt(tally.yes),
    BigInt(tally.abstain),
    BigInt(tally.no),
    BigInt(tally.no_with_veto));
}
export function mapProposal(proposal: BcProposal | undefined): StoreProposal  {
  if (proposal === undefined) {
    throw new Error('proposal is undefined');
  }

  const status = mapProposalStatus(proposal.status);
  let changes = undefined;
  if(proposal.content.changes) {
     changes = proposal.content.changes.map((el)=> {
      return new ProposalsChanges(
        el.subspace, el.key, el.value
      );
    });
  }
  let proposalPlan = undefined;
  const plan = proposal.content.plan;
  if(plan) {
    proposalPlan = new ProposalsPlan(plan.height, plan.info, plan.name, plan.time, plan.upgraded_client_state);
  }

  let amount = undefined;
  if(proposal.content.amount) {
    amount = proposal.content.amount.map((el)=> {
      return new ProposalsAmount(
        el.denom, Number(el.amount)
      );
    });
  }

  const content = new ProposalContent( proposal.content["@type"] as ProposalType, proposal.content.title, proposal.content.description, changes, proposalPlan, proposal.content.recipient, amount);
  const finalTallyResult = mapProposalTallyResult(proposal.final_tally_result);
  const totalDeposit = proposal.total_deposit.map((el)=> {
    return mapCoin(el, el.denom);
  });

  return new StoreProposal(
    Number(proposal.proposal_id),
    content, status,
    finalTallyResult,
    new Date(proposal.submit_time),
    new Date(proposal.deposit_end_time),
    totalDeposit,
    new Date(proposal.voting_start_time),
    new Date(proposal.voting_end_time)
  );
}
function mapProposalStatus(proposalStatus: string | undefined): ProposalStatus  {
  switch (proposalStatus) {
    case "PROPOSAL_STATUS_REJECTED": {
      return ProposalStatus.REJECTED;
    }
    case "PROPOSAL_STATUS_PASSED": {
      return ProposalStatus.PASSED;
    }
    case "PROPOSAL_STATUS_FAILED":{
      return ProposalStatus.FAILED;
    }
    case "PROPOSAL_STATUS_UNSPECIFIED": {
      return ProposalStatus.UNSPECIFIED;
    }
    case "PROPOSAL_STATUS_DEPOSIT_PERIOD": {
      return ProposalStatus.DEPOSIT_PERIOD;
    }
    case "PROPOSAL_STATUS_VOTING_PERIOD":{
      return ProposalStatus.VOTING_PERIOD;
    }
    default:
      throw new Error(`Unsupported proposal status type: '${ProposalStatus}'`);
  }
}


export function mapTallyParams(governanceParams: GovernanceParameters | undefined): TallyParams  {
  if (governanceParams === undefined) {
    throw new Error('mapTallyParams - governanceParams is undefined');
  }
  if (governanceParams.tally_params === undefined) {
    throw new Error('mapTallyParams - tally params is undefined');
  }
  if (governanceParams.tally_params.quorum === undefined
    || governanceParams.tally_params.threshold === undefined
    || governanceParams.tally_params.veto_threshold === undefined) {
    throw new Error('mapTallyParams - quorum or threshold or vetothreshold is undefined');
  }
  return new TallyParams(
    Number(governanceParams.tally_params.quorum),
    Number(governanceParams.tally_params.threshold),
    Number(governanceParams.tally_params.veto_threshold));
}

export function mapDepositParams(governanceParams: GovernanceParameters | undefined): Coin  {
  if (governanceParams === undefined) {
    throw new Error('mapDepositParams - governanceParams is undefined');
  }
  if (governanceParams.deposit_params === undefined) {
    throw new Error('mapDepositParams - deposit params is undefined');
  }
  if (governanceParams.deposit_params.min_deposit === undefined) {
    throw new Error('mapDepositParams - min_deposit is undefined');
  }
  const coin = governanceParams.deposit_params.min_deposit.find(c => c.denom === useConfigurationStore().config.stakingDenom);
  return mapCoin(coin, useConfigurationStore().config.stakingDenom);
}

export function mapProposalVoteResponse(proposalVoteResponse: ProposalVoteResponse | undefined): VoteOption | null {
  if (proposalVoteResponse === undefined) {
    throw new Error('mapProposalVoteResponse - proposal vote response is undefined');
  }
  if (proposalVoteResponse.data === undefined) {
    throw new Error('mapProposalVoteResponse - proposal vote response data is undefined');
  }
  if (proposalVoteResponse.data.proposal_vote === undefined) {
    throw new Error('mapProposalVoteResponse - proposal vote is undefined');
  }
  if (proposalVoteResponse.data.proposal_vote.length === 0) {
    return null;
  }
  switch (proposalVoteResponse.data.proposal_vote[0].option) {
    case "VOTE_OPTION_YES": {
      return VoteOption.Yes;
    }
    case "VOTE_OPTION_ABSTAIN": {
      return VoteOption.Abstain;
    }
    case "VOTE_OPTION_NO":{
      return VoteOption.No;
    }
    case "VOTE_OPTION_NO_WITH_VETO": {
      return VoteOption.NoWithVeto;
    }
    default:
      throw new Error(`Unsupported vote option: '${proposalVoteResponse.data.proposal_vote[0].option}'`);
  }
}
export function mapProposalsDetailsTallyResponse(proposalsDetailsTallyResponse: ProposalsDetailsTallyResult | undefined): ProposalDetailsTally | null {
  if (proposalsDetailsTallyResponse === undefined) {
    throw new Error('mapProposalsDetailsTallyResponse - mapProposalsDetailsTallyResponse is undefined');
  }
  // console.log("SDFDFSDF")
  // console.log(proposalsDetailsTallyResponse)
  // if (proposalsDetailsTallyResponse.data.proposalTallyResult === undefined) {
  //   throw new Error('mapProposalsDetailsTallyResponse - proposalTallyResult is undefined');
  // }
  // if (proposalsDetailsTallyResponse.data.stakingPool === undefined) {
  //   throw new Error('mapProposalsDetailsTallyResponse - stakingPool is undefined');
  // }
  const finalTallyResult = mapProposalTallyResult(proposalsDetailsTallyResponse.data.proposalTallyResult[0]);
  const stakingPool = mapStakingPool(proposalsDetailsTallyResponse.data.stakingPool[0]);

  return new ProposalDetailsTally(finalTallyResult, stakingPool);
}
