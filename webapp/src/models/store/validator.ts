import { useTokensStore } from "@/store/tokens.store";
import { useUserStore } from "@/store/user.store";
import { BigDecimal, divideBigInts } from "./big.decimal";
import { toPercentage } from "./common";
import i18n from '@/plugins/i18n';

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
    return this.votingPower
  }

  public get delegatedAmount(): bigint {
    return useUserStore().getDelegations.getAmountByValidator(this.operatorAddress);
  }

  // public get delegatedViewAmount(): string {
  //   return useUserStore().getDelegations.getViewAmountByValidator(this.operatorAddress);
  // }

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
        return i18n.global.t('STAKING_VIEW.VALIDATOR_STATUS.ACTIVE');
      default:
        if (this.jailed) {
          return i18n.global.t('STAKING_VIEW.VALIDATOR_STATUS.JAILED');
        }
        return i18n.global.t('STAKING_VIEW.VALIDATOR_STATUS.INACTIVE');
    }
  }

  public get active(): boolean {
    return this.status === ValidatorStatus.Bonded;
  }

  public getDelegatedViewAmount(precision = 4): string {
    return useUserStore().getDelegations.getViewAmountByValidator(this.operatorAddress, precision);
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

  public get rateViewPercentage(): number | bigint | BigDecimal {
    return this.rate
  }
}

export enum ValidatorStatus {
  Bonded,
  Unbonding,
  Unbonded,
  Unspecified
}
