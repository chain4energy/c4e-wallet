import { GovernanceParameters, Proposal as BcProposal, Tally } from "@/models/blockchain/proposals";
import { mapCoin } from "@/models/mapper/common.mapper"
import {
  Proposal as StoreProposal,
  ProposalContent,
  ProposalsChanges,
  ProposalsValue,
  ProposalTallyResult,
  ProposalStatus,
  TallyParams,
} from "@/models/store/proposal";
import { Coin } from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";

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
  const result = mapProposal(proposal)

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
  // const changes = proposal.content.changes.map((el)=> {
  //   return new ProposalsChanges(
  //     el.subspace, el.key, el.value
  //   );
  // })

  const content = new ProposalContent(proposal.content["@type"], proposal.content.title, proposal.content.description/*, changes*/);
  const finalTallyResult = mapProposalTallyResult(proposal.final_tally_result);
  const totalDeposit = proposal.total_deposit.map((el)=> {
    return mapCoin(el, el.denom)
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
  )
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