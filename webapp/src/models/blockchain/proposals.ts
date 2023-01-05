import { PaginatedResponse } from "@/models/blockchain/pagination";
import { Coin } from "./common";

export interface ProposalsResponse extends PaginatedResponse {
  proposals: Proposal[]
}
export interface ProposalResponse{
  proposal : Proposal,
}
export interface Proposal {
  proposal_id: string,
  content: {
    "@type": string,
    title: string,
    description: string,
    changes: Array<ProposalChanges>,
    plan: ProposalPlan | undefined,
    amount: Array<ProposalAmount> | undefined,
    recipient: string | undefined
  },
  status: string,
  final_tally_result: Tally,
  submit_time: string,
  deposit_end_time: string,
  total_deposit:Array<Coin>
  voting_start_time: string,
  voting_end_time: string,
}

export interface ProposalAmount {
  denom: string,
  amount: string
}
export interface ProposalPlan {
  height: string,
  info: string,
  name: string,
  time: string,
  upgraded_client_state: string
}
export interface ProposalChanges{
  value: ProposalsValue;
  key: string;
  subspace: string;
}
export interface ProposalsValue{
  mindeposit: string;
}

export interface GovernanceParameters {
  voting_params: VotingParams;
  deposit_params: DepositParams;
  tally_params: TallyParams;
}

export interface VotingParams {
  voting_period: string;
}
export interface DepositParams {
  min_deposit: Coin[],
  max_deposit_period: string
}
export interface TallyParams {
  quorum: string;
  threshold: string;
  veto_threshold: string;
}

export interface Tally {
  yes: string,
  abstain: string,
  no: string,
  no_with_veto: string,
}
export interface TallyResponse {
  tally: Tally
}

