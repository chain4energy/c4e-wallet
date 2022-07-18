import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";

export class Validator{
  operatorAddress: string;
  jailed: boolean;
  status: ValidatorStatus;
  tokens: string;
  description: ValidatorDescription;
  commission: ValidatorCommission;
  rank: number;

  constructor (operatorAddress: string,
      jailed: boolean,
      status: ValidatorStatus,
      tokens: string,
      description: ValidatorDescription,
      commission: ValidatorCommission) {
    this.operatorAddress = operatorAddress
    this.jailed = jailed
    this.status = status
    this.tokens = tokens
    this.description = description
    this.commission = commission
    this.rank = 0
  }

  public get votingPower(): number {
    const total = useTokensStore().getStakingPool.bonded_tokens
    if(total){
      return (Number(this.tokens) / total) * 100;
    }
    return 0;
  }

  public get delegatedAmount(): string {
    return useUserStore().getDelegations.getAmountByValidator(this.operatorAddress);
  }

  public get undelegatingAmount(): number {
    return useUserStore().getUndelegations.getAmountByValidator(this.operatorAddress);
  }

  public get rewardsAmount(): string {
    return useUserStore().getRewardList.getAmountByValidator(this.operatorAddress);
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
    this.moniker = moniker
    this.identity = identity
    this.website = website
    this.securityContact = securityContact
    this.details = details
  }
}

export class ValidatorCommission {
  rate: string;
  maxRate: string;
  maxChangeRate: string;

  constructor (rate: string,
      max_rate: string,
      max_change_rate: string) {
    this.rate = rate
    this.maxRate = max_rate
    this.maxChangeRate = max_change_rate
  }
}

export enum ValidatorStatus {
  Bonded,
  Unbonding,
  Unbonded,
  Unspecified
}

