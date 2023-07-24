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
  VoteOption,
  ProposalsPlan,
  ProposalsAmount,
  ProposalType,
  ProposalsChanges,
  ProposalDetailsTally,
  SubDistributor,
  Account, Destinations, Minter, ProposalMessage,
} from "@/models/store/proposal";
import { Coin } from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { ProposalVoteResponse } from "../hasura/proposal.vote";
import {mapStakingPool} from "@/models/mapper/tokens.mapper";
import {StakingPool as StoreStakingPool} from "@/models/store/tokens";

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

  if (tally.yes_count === undefined ||
      tally.no_count === undefined ||
      tally.abstain_count === undefined ||
      tally.no_with_veto_count === undefined) {
    throw new Error('mapProposalTallyResult - some of tally votes is undefined');
  }
  return new ProposalTallyResult(
    BigInt(tally.yes_count),
    BigInt(tally.abstain_count),
    BigInt(tally.no_count),
    BigInt(tally.no_with_veto_count));
}
export function mapProposal(proposal: BcProposal | undefined): StoreProposal  {
  if (proposal === undefined) {
    throw new Error('proposal is undefined');
  }
  const status = mapProposalStatus(proposal.status);
  const finalTallyResult = mapProposalTallyResult(proposal.final_tally_result);
  const totalDeposit = proposal.total_deposit.map((el)=> {
    return mapCoin(el, el.denom);
  });

 if(proposal.messages[0]['@type'] === ProposalType.LEGACY_CONTENT) {

    let changes = undefined;
    if(proposal.messages[0].content?.changes) {
      changes = proposal.messages[0]?.content?.changes.map((el)=> {
        return new ProposalsChanges(
          el.subspace, el.key, el.value
        );
      });
    }
    let proposalPlan = undefined;
    const plan = proposal.messages[0]?.content?.plan;
    if(plan) {
      proposalPlan = new ProposalsPlan(plan.height, plan.info, plan.name, plan.time, plan.upgraded_client_state);
    }

    let amount = undefined;
    if(proposal.messages[0]?.content?.amount) {
      amount = proposal.messages[0].content.amount.map((el)=> {
        return new ProposalsAmount(
          el.denom, Number(el.amount)
        );
      });
    }

    const content = new ProposalContent( proposal.messages[0].content["@type"] as ProposalType, proposal?.messages[0]?.content?.title, proposal.messages[0].content.description, changes, proposalPlan, proposal.messages[0].content.recipient, amount);

    return new StoreProposal(
      Number(proposal.id),
      content, status,
      finalTallyResult,
      new Date(proposal.submit_time),
      new Date(proposal.deposit_end_time),
      totalDeposit,
      new Date(proposal.voting_start_time),
      new Date(proposal.voting_end_time),
      undefined,
      proposal.messages[0]["@type"],
      proposal.metadata
    );
  } else {
   let subDistributors = undefined;
   if(proposal.messages[0].sub_distributors) {
     subDistributors = proposal.messages[0].sub_distributors.map(el => {
       let sources = undefined;
       sources = el.sources.map(source => {
         return new Account(source.id, source.type);
       });
       const destinations = new Destinations(el.destinations.burn_share, el.destinations.primary_share, el.destinations.shares);
       return new SubDistributor(el.name, sources, destinations);
     });
   }

   let subDistributor = undefined;
   const bcSubDistributor = proposal.messages[0].sub_distributor
   if(bcSubDistributor) {
     const destinations = new Destinations(bcSubDistributor.destinations.burn_share, bcSubDistributor.destinations.primary_share, bcSubDistributor.destinations.shares);
     subDistributor = new SubDistributor(bcSubDistributor.name,
       bcSubDistributor.sources,
       destinations);
   }

   let minters = undefined;
   const bcMinters = proposal.messages[0].minters;
   if(bcMinters) {
     minters = bcMinters.map(el => {
       return new Minter(el.sequence_id, el.end_time, el.config);
     });
   }
   const proposalMessages = proposal.messages[0];
   const messages = new ProposalMessage(proposalMessages["@type"] as ProposalType, proposalMessages.authority, proposalMessages.sub_distributor_name,
     proposalMessages.destination_name, proposalMessages.burnShare, proposalMessages.share, subDistributors, subDistributor, proposalMessages.start_time, minters);

   return new StoreProposal(
     Number(proposal.id),
     undefined, status,
     finalTallyResult,
     new Date(proposal.submit_time),
     new Date(proposal.deposit_end_time),
     totalDeposit,
     new Date(proposal.voting_start_time),
     new Date(proposal.voting_end_time),
     messages,
     proposal.messages[0]["@type"] as ProposalType,
     proposal.metadata
   );
  }


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

export function mapProposalsDetailsTallyListResponse(proposalsDetailsTallyResponse: ProposalsDetailsTallyResult | undefined): Map<number, ProposalDetailsTally> | null {
  if (proposalsDetailsTallyResponse === undefined) {
    throw new Error('mapProposalsDetailsTallyResponse - mapProposalsDetailsTallyResponse is undefined');
  }
  // console.log(proposalsDetailsTallyResponse)
  // if (proposalsDetailsTallyResponse.data.proposalTallyResult === undefined) {
  //   throw new Error('mapProposalsDetailsTallyResponse - proposalTallyResult is undefined');
  // }
  // if (proposalsDetailsTallyResponse.data.stakingPool === undefined) {
  //   throw new Error('mapProposalsDetailsTallyResponse - stakingPool is undefined');
  // }
  const finallTallyMap = new Map<number, ProposalTallyResult>();
  const stakingPoolMap = new Map<number, StoreStakingPool>();
  proposalsDetailsTallyResponse.data.proposalTallyResult.forEach(res => {
    const finalTallyResult = mapProposalTallyResult(res);
    if (res.proposal_id) {
      finallTallyMap.set(res.proposal_id, finalTallyResult);
    }
  });
  proposalsDetailsTallyResponse.data.stakingPool.forEach(res => {
    const stakingPool = mapStakingPool(res);
    if(res.proposal_id)
      stakingPoolMap.set(res.proposal_id, stakingPool);
  });
  const resultMap = new Map<number, ProposalDetailsTally>();

  finallTallyMap.forEach((value: ProposalTallyResult, key: number) => {
    const stakingPool = stakingPoolMap.get(key);
    if(stakingPool)
      resultMap.set(key, new ProposalDetailsTally(value, stakingPool));
  });

  return resultMap;
}
