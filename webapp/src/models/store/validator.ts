import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { BigDecimal } from "./big.decimal";

export class Validator{
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

  public get votingPower(): number {
    const total = useTokensStore().getStakingPool.bondedTokens;
    if(total || total > 0n){
      return Number((this.tokens * 1000000n) / total)/10000;
    }
    return 0;
  }

  public get delegatedAmount(): bigint {
    return useUserStore().getDelegations.getAmountByValidator(this.operatorAddress);
  }

  public get delegatedViewAmount(): string {
    return useUserStore().getDelegations.getViewAmountByValidator(this.operatorAddress);
  }

  public get undelegatingAmount(): bigint {
    return useUserStore().getUndelegations.getAmountByValidator(this.operatorAddress);
  }

  public get undelegatingViewAmount(): string {
    return useUserStore().getUndelegations.getViewAmountByValidator(this.operatorAddress);
  }

  public get rewardsAmount(): BigDecimal {
    return useUserStore().getRewards.getAmountByValidator(this.operatorAddress);
  }

  public get rewardsViewAmount(): string {
    return useUserStore().getRewards.getViewAmountByValidator(this.operatorAddress);
  }

  public get viewStatus(): string {
    switch (this.status) {
      case ValidatorStatus.Bonded:
        return 'Active';  // TODO place it in locales config
      default:
        if (this.jailed) {
          return 'Jailed'; // TODO place it in locales config
        }
        return 'Inactive'; // TODO place it in locales config
    }
  }

}

export class ValidatorDescription {
  moniker: string;
  identity: string;
  website: string;
  securityContact: string;
  details: string;

  constructor (moniker: string,
      identity: string,
      website: string,
      securityContact: string,
      details: string) {
    this.moniker = moniker;
    this.identity = identity;
    this.website = website;
    this.securityContact = securityContact;
    this.details = details;
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
