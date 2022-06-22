import {Pagination} from "@/models/pagination";
import {ProposalStatusEnum} from "@/models/proposalStatus-enum";

export class Proposals {

  pagination: Pagination = new Pagination();
  proposals: Proposal[] = Array<Proposal>();

}

export class Proposal {
  proposal_id = String;
  content = Content;
  status = ProposalStatusEnum;
  final_tally_result = FinalTallyResult;
  submit_time= Date;
  deposit_end_time= Date;
  total_deposit= TotalDeposit;
  voting_start_time= Date;
  voting_end_time= Date;
}

export class Content {
  type_url= String;
  value= String;
}
export class FinalTallyResult {
  yes= String;
  abstain= String;
  no= String;
  no_with_veto=String;
}
export class TotalDeposit {
  denom= String;
  amount= String;
}
