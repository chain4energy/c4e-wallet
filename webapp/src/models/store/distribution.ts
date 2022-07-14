import { useConfigurationStore } from "@/store/configuration.store";
import { Coin } from "./account";

export class ValidatorRewards {
  validatorAddress: string;
  rewards: Coin[];

  constructor (validatorAddress: string, rewards: Coin[]) {
    this.validatorAddress = validatorAddress
    this.rewards = rewards
  }

  public getByDenom(denom: string): Coin {
    const result = this.rewards.find(coin => coin.denom === denom)
    return result === undefined ? new Coin('0', denom) : result;
  }
}

export class Rewards {
  rewards: Map<string, ValidatorRewards>;
  totalRewards: number;

  constructor (rewards = new Map<string, ValidatorRewards>(), totalRewards = 0) {
    this.rewards = rewards
    this.totalRewards = totalRewards
  }

  public getAmountByValidator(validatorAddress: string): string {
    const amount = this.rewards.get(validatorAddress)?.getByDenom(useConfigurationStore().config.stakingDenom).amount
    return amount === undefined ? "0" : amount
  }

  public getAllValidatorsAddresses(): IterableIterator<string> {
    return this.rewards.keys()
  }

  // public isEmpty(): boolean {
  //   return this.rewards.size === 0
  // }
}