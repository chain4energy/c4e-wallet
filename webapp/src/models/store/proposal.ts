import {Coin, findByDenom, toPercentage} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal, divideBigInts } from "./big.decimal";
import { VoteOption as CosmVoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";

export enum ProposalStatus {
  PASSED= 'PROPOSAL_STATUS_PASSED' ,
  REJECTED ='PROPOSAL_STATUS_REJECTED' ,
  FAILED ='PROPOSAL_STATUS_FAILED',
  UNSPECIFIED = 'PROPOSAL_STATUS_UNSPECIFIED',
  DEPOSIT_PERIOD = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  VOTING_PERIOD = 'PROPOSAL_STATUS_VOTING_PERIOD'
}

export enum VoteOption {
  Yes = CosmVoteOption.VOTE_OPTION_YES,
  Abstain = CosmVoteOption.VOTE_OPTION_ABSTAIN,
  No = CosmVoteOption.VOTE_OPTION_NO,
  NoWithVeto = CosmVoteOption.VOTE_OPTION_NO_WITH_VETO,
}

export class Proposal {
  proposalId: number;
  content: ProposalContent;
  status: ProposalStatus;
  finalTallyResult: ProposalTallyResult;
  submitTime: Date;
  depositEndTime: Date;
  totalDeposit: Array<Coin>;
  votingStartTime: Date;
  votingEndTime :Date;
  constructor (
    proposalId: number,
    content: ProposalContent,
    status: ProposalStatus,
    finalTallyResult: ProposalTallyResult,
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

  public isDepositPeriod() {
    return this.status === ProposalStatus.DEPOSIT_PERIOD;
  }

  public isVotingPeriod() {
    return this.status === ProposalStatus.VOTING_PERIOD;
  }

  public getTotalDepositByDenom(denom = useConfigurationStore().config.stakingDenom): Coin {
    return findByDenom(this.totalDeposit, denom);
  }
}
export class ProposalContent {
  type: string;
  title: string;
  description: string;
  // changes: Array<ProposalsChanges>

  constructor(type: string, title: string, description: string/*, changes: Array<ProposalsChanges>*/) {
    this.type = type;
    this.title = title;
    this.description = description;
    // this.changes= changes;
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

export class ProposalTallyResult{
  yes: bigint;
  abstain: bigint;
  no: bigint;
  noWithVeto: bigint;
  constructor(
    yes: bigint,
    abstain: bigint,
    no: bigint,
    noWithVeto: bigint) {
    this.yes = yes;
    this.abstain = abstain;
    this.no = no;
    this.noWithVeto = noWithVeto;
  }

  public get total(): bigint {
    return this.yes + this.abstain + this.no + this.noWithVeto;
  }

  public getYesPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.yes, this.total);
  }

  public getAbstainPercentage(): BigDecimal{
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.abstain, this.total);
  }

  public getNoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.no, this.total);
  }

  public getNoWithVetoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.noWithVeto, this.total);
  }
}

export class TallyParams {
  quorum: number;
  threshold: number;
  vetoThreshold: number;

  constructor(
    quorum: number,
    threshold: number,
    vetoThreshold: number
  ) {
    this.quorum = quorum;
    this.threshold = threshold;
    this.vetoThreshold = vetoThreshold;
  }

}
