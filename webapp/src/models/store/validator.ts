import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { BigDecimal, divideBigInts } from "./big.decimal";
import { UnbondingDelegationEntry } from "./staking";

export interface ValidatorBase {
  rank: number;
  operatorAddress: string;
  description: ValidatorDescriptionBase;
}

export interface ValidatorDescriptionBase {
  moniker: string;
  pictureUrl?: string;
}

export class Validator implements ValidatorBase {
  operatorAddress: string;
  jailed: boolean;
  status: ValidatorStatus;
  tokens: bigint;
  description: ValidatorDescription;
  commission: ValidatorCommission;
  rank: number;

  constructor (operatorAddress: string,
      jailed: boolean,
      status: ValidatorStatus,
      tokens: bigint,
      description: ValidatorDescription,
      commission: ValidatorCommission) {
    this.operatorAddress = operatorAddress;
    this.jailed = jailed;
    this.status = status;
    this.tokens = tokens;
    this.description = description;
    this.commission = commission;
    this.rank = 0;
  }

  public get votingPower(): BigDecimal {
    const total = useTokensStore().getStakingPool.bondedTokens;
    if(total || total > 0n){
      return divideBigInts(this.tokens, total);
    }
    return new BigDecimal(0);
  }

  public get votingPowerViewPercentage(): number | bigint | BigDecimal {
    return this.votingPower;
  }

  public get delegatedAmount(): bigint {
    return useUserStore().getDelegations.getAmountByValidator(this.operatorAddress);
  }

  public get undelegatingAmount(): bigint {
    return useUserStore().getUndelegations.getAmountByValidator(this.operatorAddress);
  }

  public get rewardsAmount(): BigDecimal {
    return useUserStore().getRewards.getAmountByValidator(this.operatorAddress);
  }

  public get rewardsAmountSort(): string {
    return useUserStore().getRewards.getAmountByValidator(this.operatorAddress).toString();
  }

  public get active(): boolean {
    return this.status === ValidatorStatus.Bonded;
  }

  public get undelegatingEntries(): UnbondingDelegationEntry[] | undefined {
    return useUserStore().getUndelegations.getEntriesByValidator(this.operatorAddress);
  }
}

export class ValidatorDescription implements ValidatorDescriptionBase{
  moniker: string;
  identity: string;
  website: string;
  securityContact: string;
  details: string;
  pictureUrl?: string;
  constructor (moniker: string,
      identity: string,
      website: string,
      securityContact: string,
      details: string,
      pictureUrl?: string) {
    this.moniker = moniker;
    this.identity = identity;
    this.website = website;
    this.securityContact = securityContact;
    this.details = details;
    this.pictureUrl = pictureUrl;
  }
}

export class ValidatorCommission {
  rate: number;
  maxRate: number;
  maxChangeRate: number;

  constructor (rate: number,
      max_rate: number,
      max_change_rate: number) {
    this.rate = rate;
    this.maxRate = max_rate;
    this.maxChangeRate = max_change_rate;
  }

}

export enum ValidatorStatus {
  Bonded,
  Unbonding,
  Unbonded,
  Unspecified
}
