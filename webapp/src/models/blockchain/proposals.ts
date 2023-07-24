import { PaginatedResponse } from "@/models/blockchain/pagination";
import { Coin } from "./common";
import {StakingPool} from "@/models/store/tokens";
import {StakingPool as BcStakingPool} from "@/models/blockchain/tokens";

export interface ProposalsResponse extends PaginatedResponse {
  proposals: Proposal[]
}
export interface ProposalResponse{
  proposal : Proposal,
}
export interface Proposal {
  id: string,
  // content: {
  //   "@type": string,
  //   title: string,
  //   description: string,
  //   changes: Array<ProposalChanges>,
  //   plan: ProposalPlan | undefined,
  //   amount: Array<ProposalAmount> | undefined,
  //   recipient: string | undefined
  // },
  messages: Message[],
  status: string,
  final_tally_result: Tally,
  submit_time: string,
  deposit_end_time: string,
  total_deposit:Array<Coin>
  voting_start_time: string,
  voting_end_time: string,
  metadata: string
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
  proposal_id?: number,
  yes_count: string,
  abstain_count: string,
  no_count: string,
  no_with_veto_count: string,
}
export interface TallyResponse {
  tally: Tally
}

export interface ProposalsDetailsTallyResult {
  data: {
    proposalTallyResult: Tally[],
    stakingPool: BcStakingPool[]
  }

}

export interface Message {
  "@type": string,
  content: {
    "@type": string,
    title: string,
    description: string,
    changes: Array<ProposalChanges>,
    plan: ProposalPlan | undefined,
    amount: Array<ProposalAmount> | undefined,
    recipient: string | undefined
  },
  authority: string,
  sub_distributor_name: string,
  destination_name: string,
  burnShare: string,
  share: string,
  sub_distributors: SubDistributor[],
  sub_distributor: SubDistributor | undefined,
  start_time: string,
  minters: Minter[]

}
export interface SubDistributor {
  name: string,
  sources: Account[],
  destinations: Destinations
}
export interface Account {
  id: string,
  type: string
}
export interface Destinations {
  burn_share: string,
  primary_share: Account,
  shares: DestinationShare[]
}
export interface DestinationShare {
  name: string,
  share: string,
  destination: Account
}
export interface Minter {
  sequence_id: number;
  end_time: string | undefined;
  config: any | undefined;
}
