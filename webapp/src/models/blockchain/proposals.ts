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
    type: string,
    title: string,
    description: string,
    changes: Array<ProposalChanges>
  },
  status: string,
  final_tally_result: {
    yes: string,
    abstain: string,
    no: string,
    no_with_veto: string,
  },
  submit_time: string,
  deposit_end_time: string,
  total_deposit:Array<Coin>
  voting_start_time: string,
  voting_end_time: string,
}

export interface ProposalChanges{
  value: ProposalsValue;
  key: string;
  subspace: string;
}
export interface ProposalsValue{
  mindeposit: string;
}

