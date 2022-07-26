export enum ProposalStatus {
  PASSED= 'PROPOSAL_STATUS_PASSED' ,
  REJECTED ='PROPOSAL_STATUS_REJECTED' ,
  FAILED ='PROPOSAL_STATUS_FAILED',
  UNSPECIFIED = 'PROPOSAL_STATUS_UNSPECIFIED',
  DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD'
}
export class Proposal {
  proposal_id: string;
  content: ProposalContent;
  status: ProposalStatus;
  final_tally_result: ProposalsTallyRes;
  submit_time: string;
  deposit_end_time: string;
  total_deposit: Array<ProposalDeposit>;
  voting_start_time: string;
  voting_end_time :string;
  constructor (
    proposal_id: string,
    content: ProposalContent,
    status: ProposalStatus,
    final_tally_result: ProposalsTallyRes,
    submit_time: string,
    deposit_end_time: string,
    total_deposit: Array<ProposalDeposit>,
    voting_start_time: string,
    voting_end_time: string,
  ) {
    this.proposal_id = proposal_id;
    this.content = content;
    this.status = status;
    this.final_tally_result = final_tally_result;
    this.submit_time = submit_time;
    this.deposit_end_time = deposit_end_time;
    this.total_deposit = total_deposit;
    this.voting_start_time = voting_start_time;
    this.voting_end_time = voting_end_time;
  }

}
export class ProposalContent {
  type: string;
  title: string;
  description: string;
  changes: Array<ProposalsChanges>

  constructor(type: string, title: string, description: string, changes: Array<ProposalsChanges>) {
    this.type = type;
    this.title = title;
    this.description = description;
    this.changes= changes;
  }
}
export class ProposalsChanges{
  subspace: string;
  key: string;
  value: ProposalsValue
  constructor(subspace:string, key: string, value : ProposalsValue) {
    this.key=key;
    this.subspace=subspace;
    this.value = value;
  }
}
export class ProposalsValue{
  mindeposit: string;
  constructor(mindeposit: string) {
    this.mindeposit=mindeposit;
  }
}

export class ProposalsTallyRes{
  yes: string;
  abstain: string;
  no: string;
  no_with_veto: string;
  constructor(
    yes: string,
    abstain: string,
    no: string,
    no_with_veto: string) {
    this.yes = yes;
    this.abstain = abstain;
    this.no = no;
    this.no_with_veto= no_with_veto;
  }
}

export class ProposalDeposit{
  denom: string;
  amount: string;
  constructor(
    denom: string,
    amount: string,
  ) {
    this.denom = denom;
    this.amount = amount;
  }
}
