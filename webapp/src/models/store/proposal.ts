import {Coin} from "@/models/store/common";

export enum ProposalStatus {
  PASSED= 'PROPOSAL_STATUS_PASSED' ,
  REJECTED ='PROPOSAL_STATUS_REJECTED' ,
  FAILED ='PROPOSAL_STATUS_FAILED',
  UNSPECIFIED = 'PROPOSAL_STATUS_UNSPECIFIED',
  DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD'
}
export class Proposal {
  proposalId: number;
  content: ProposalContent;
  status: ProposalStatus;
  finalTallyResult: ProposalsTallyRes;
  submitTime: Date;
  depositEndTime: Date;
  totalDeposit: Array<Coin>;
  votingStartTime: Date;
  votingEndTime :Date;
  constructor (
    proposalId: number,
    content: ProposalContent,
    status: ProposalStatus,
    finalTallyResult: ProposalsTallyRes,
    submitTime: Date,
    depositEndTime: Date,
    totalDeposit: Array<Coin>,
    votingStartTime: Date,
    votingEndTime: Date,
  ) {
    this.proposalId = proposalId;
    this.content = content;
    this.status = status;
    this.finalTallyResult = finalTallyResult;
    this.submitTime = submitTime;
    this.depositEndTime = depositEndTime;
    this.totalDeposit = totalDeposit;
    this.votingStartTime = votingStartTime;
    this.votingEndTime = votingEndTime;
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
  yes: number;
  abstain: number;
  no: number;
  noWithVeto: number;
  constructor(
    yes: number,
    abstain: number,
    no: number,
    noWithVeto: number) {
    this.yes = yes;
    this.abstain = abstain;
    this.no = no;
    this.noWithVeto= noWithVeto;
  }
}

export class ProposalDeposit{
  denom: string;
  amount: bigint;
  constructor(
    denom: string,
    amount: bigint,
  ) {
    this.denom = denom;
    this.amount = amount;
  }
}
