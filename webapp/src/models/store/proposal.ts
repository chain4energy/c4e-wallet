import {Coin, findByDenom } from "@/models/store/common";
import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal, divideBigInts } from "./big.decimal";
import { VoteOption as CosmVoteOption } from "cosmjs-types/cosmos/gov/v1beta1/gov";
import {StakingPool} from "@/models/store/tokens";
import {useProposalsStore} from "@/store/proposals.store";
import {useTokensStore} from "@/store/tokens.store";

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
  content: ProposalContent | undefined;
  status: ProposalStatus;
  finalTallyResult: ProposalTallyResult;
  submitTime: Date;
  depositEndTime: Date;
  totalDeposit: Array<Coin>;
  votingStartTime: Date;
  votingEndTime :Date;
  messages: ProposalMessage | undefined;
  type: ProposalType;
  metaData: string;
  constructor (
    proposalId: number,
    content: ProposalContent | undefined,
    status: ProposalStatus,
    finalTallyResult: ProposalTallyResult,
    submitTime: Date,
    depositEndTime: Date,
    totalDeposit: Array<Coin>,
    votingStartTime: Date,
    votingEndTime: Date,
    messages: ProposalMessage | undefined,
    type: ProposalType,
    metadata: string
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
    this.messages = messages;
    this.type = type;
    this.metaData = metadata;
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
  type: ProposalType;
  title: string;
  description: string;
  changes: Array<ProposalsChanges> | undefined;
  plan: ProposalsPlan | undefined;
  recipient: string | undefined;
  amount: Array<ProposalsAmount> | undefined;


  constructor(type: ProposalType, title: string, description: string, changes: Array<ProposalsChanges> | undefined, plan: ProposalsPlan | undefined, recipient: string | undefined, amount: Array<ProposalsAmount> | undefined) {
    this.type = type;
    this.title = title;
    this.description = description;
    this.changes= changes;
    this.plan = plan;
    this.recipient = recipient;
    this.amount = amount;
  }
}

export class ProposalMessage {
  type: string;
  authority: string;
  sub_distributor_name: string;
  destination_name: string;
  burnShare: string;
  share: string;
  subDistributors: SubDistributor[] | undefined;
  subDistributor: SubDistributor | undefined;
  startTime: string;
  minters: Minter[] | undefined;

  constructor(type: string, authority: string, sub_distributor_name: string, destination_name: string, burnShare: string, share: string, sub_distributors: SubDistributor[] | undefined, sub_distributor: SubDistributor | undefined, start_time: string, minters: Minter[] | undefined) {
    this.type = type;
    this.authority = authority;
    this.sub_distributor_name = sub_distributor_name;
    this.destination_name = destination_name;
    this.burnShare = burnShare;
    this.share = share;
    this.subDistributors = sub_distributors;
    this.subDistributor = sub_distributor;
    this.startTime = start_time;
    this.minters = minters;
  }
}
export class SubDistributor {
  name: string;
  sources: Account[];
  destinations: Destinations;

  constructor(name: string, sources: Account[], destinations: Destinations) {
    this.name = name;
    this.sources = sources;
    this.destinations = destinations;
  }
}
export class Account {
  id: string;
  type: string;

  constructor(id: string, type: string) {
    this.id = id;
    this.type = type;
  }
}
export class Destinations {
  burnShare: string;
  primaryShare: Account;
  shares: DestinationShare[];

  constructor(burn_share: string, primary_share: Account, shares: DestinationShare[]) {
    this.burnShare = burn_share;
    this.primaryShare = primary_share;
    this.shares = shares;
  }
}
export class DestinationShare {
  name: string;
  share: string;
  destination: Account;

  constructor(name: string, share: string, destination: Account) {
    this.name = name;
    this.share = share;
    this.destination = destination;
  }
}
export class Minter {
  sequenceId: number;
  endTime: string | undefined;
  config: any | undefined;

  constructor(sequence_id: number, end_time: string | undefined, config: any) {
    this.sequenceId = sequence_id;
    this.endTime = end_time;
    this.config = config;
  }
}

export class ProposalsAmount {
  denom: string;
  amount: number;

  constructor(denom: string, amount: number) {
    this.denom = denom;
    this.amount = amount;
  }
}
export enum ProposalType {
  SOFTWARE_UPGRADE='/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal',
  TEXT = '/cosmos.gov.v1beta1.TextProposal',
  COMMUNITY_POOL_SPEND='/cosmos.distribution.v1beta1.CommunityPoolSpendProposal',
  CANCEL_SOFTWARE_UPGRADE ='/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal',
  PARAMETER_CHANGE = '/cosmos.params.v1beta1.ParameterChangeProposal',
  LEGACY_CONTENT = '/cosmos.gov.v1.MsgExecLegacyContent'
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
export class ProposalsPlan {
  height: string;
  info: string;
  name: string;
  time: string;
  upgradedClientState: string;


  constructor(height: string, info: string, name: string, time: string, upgradedClient: string) {
    this.height = height;
    this.info = info;
    this.name = name;
    this.time = time;
    this.upgradedClientState = upgradedClient;
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
    return divideBigInts(this.yes, useTokensStore().getStakingPool.bondedTokens);
  }

  public getAbstainPercentage(): BigDecimal{
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.abstain, useTokensStore().getStakingPool.bondedTokens);
  }

  public getNoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.no, useTokensStore().getStakingPool.bondedTokens);
  }

  public getNoWithVetoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.noWithVeto, useTokensStore().getStakingPool.bondedTokens);
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
export class ProposalDetailsTally {
  proposalTally: ProposalTallyResult;
  stakingPool: StakingPool;


  constructor(proposalTally: ProposalTallyResult, stakingPool: StakingPool) {
    this.proposalTally = proposalTally;
    this.stakingPool = stakingPool;
  }

  public get total(): bigint {
    return this.stakingPool.bondedTokens;
  }

  public getYesPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.proposalTally.yes, this.total);
  }
  public getAbstainPercentage(): BigDecimal{
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.proposalTally.abstain, this.total);
  }

  public getNoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.proposalTally.no, this.total);
  }

  public getNoWithVetoPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.proposalTally.noWithVeto, this.total);
  }

  public getNotVotedPercentage(): BigDecimal {
    if (this.total <= 0n) {
      return new BigDecimal(0);
    }
    return divideBigInts(this.getNotVoted(), this.total);
  }

  public getAbstain(): bigint{
    return this.proposalTally.abstain;
  }

  public getYes(): bigint{
    return this.proposalTally.yes;
  }
  public getNoWithVeto(): bigint{
    return this.proposalTally.noWithVeto;
  }
  public getNo(): bigint{
    return this.proposalTally.no;
  }
  public getNotVoted(): bigint {
    return this.total - this.proposalTally.yes - this.proposalTally.no - this.proposalTally.abstain - this.proposalTally.noWithVeto;
  }
}

