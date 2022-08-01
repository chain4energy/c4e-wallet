import {Coin, findByDenom, toPercentage} from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { divideBigInts } from "./big.decimal";

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

  public getTotalView(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.total, precision, reduceBigNumber);
  }

  public getYesView(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.yes, precision, reduceBigNumber);
  }

  public getAbstainView(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.abstain, precision, reduceBigNumber);
  }

  public getNoView(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.no, precision, reduceBigNumber);
  }

  public getNoWithVetoView(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.noWithVeto, precision, reduceBigNumber);
  }

  public getYesPercentageView(precision = 2): string {
    if (this.total <= 0n) {
      return toPercentage(0, precision);
    }
    return toPercentage(divideBigInts(this.yes, this.total), precision);
  }

  public getAbstainPercentageView(precision = 2): string {
    if (this.total <= 0n) {
      return toPercentage(0, precision);
    }
    return toPercentage(divideBigInts(this.abstain, this.total), precision);
  }

  public getNoPercentageView(precision = 2): string {
    if (this.total <= 0n) {
      return toPercentage(0, precision);
    }
    return toPercentage(divideBigInts(this.no, this.total), precision);
  }

  public getNoWithVetoPercentageView(precision = 2): string {
    if (this.total <= 0n) {
      return toPercentage(0, precision);
    }
    return toPercentage(divideBigInts(this.noWithVeto, this.total), precision);
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

  public getQuorumPercentageView(precision = 2): string {
    return toPercentage(this.quorum, precision);
  }

  public getThresholdPercentageView(precision = 2): string {
    return toPercentage(this.threshold, precision);
  }

  public getVetoThresholdPercentageView(precision = 2): string {
    return toPercentage(this.vetoThreshold, precision);
  }
}
