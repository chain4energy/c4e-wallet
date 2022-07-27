import { Proposal as BcProposal } from "@/models/blockchain/proposals";
import { mapCoin } from "@/models/mapper/common.mapper"
import {
  Proposal as StoreProposal,
  ProposalContent,
  ProposalsChanges,
  ProposalsValue,
  ProposalsTallyRes,
  ProposalStatus,
} from "@/models/store/proposal";
import { Coin } from "@/models/store/common";

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
export function mapProposal(proposal: BcProposal | undefined): StoreProposal  {
  if (proposal === undefined) {
    throw new Error('proposal is undefined');
  }

  const status = mapProposalStatus(proposal.status);
  const changes = proposal.content.changes.map((el)=> {
    return new ProposalsChanges(
      el.subspace, el.key, el.value
    );
  })

  const content = new ProposalContent(proposal.content["@type"], proposal.content.title, proposal.content.description, changes);
  const finalTallyResult = new ProposalsTallyRes(
    Number(proposal.final_tally_result.yes),
    Number(proposal.final_tally_result.abstain),
    Number(proposal.final_tally_result.no),
    Number(proposal.final_tally_result.no_with_veto));
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
