import { useConfigurationStore } from "@/store/configuration.store";
import { DecCoin } from "./common";

export class ValidatorRewards {
  validatorAddress: string;
  rewards: DecCoin[];

  constructor (validatorAddress: string, rewards: DecCoin[]) {
    this.validatorAddress = validatorAddress;
    this.rewards = rewards;
  }

  public getByDenom(denom: string): DecCoin {
    const result = this.rewards.find(coin => coin.denom === denom);
    return result === undefined ? new DecCoin('0', denom) : result;
  }
}

export class Rewards {
  rewards: Map<string, ValidatorRewards>;
  totalRewards: number; // TODO BigDecimal

  constructor (rewards = new Map<string, ValidatorRewards>(), totalRewards = 0) {
    this.rewards = rewards;
    this.totalRewards = totalRewards;
  }

  public getAmountByValidator(validatorAddress: string): string {
    const amount = this.rewards.get(validatorAddress)?.getByDenom(useConfigurationStore().config.stakingDenom).amount;
    return amount === undefined ? "0" : amount;
  }

  public getViewAmountByValidator(validatorAddress: string): string {
    const amount = this.rewards.get(validatorAddress)?.getByDenom(useConfigurationStore().config.stakingDenom).getViewAmount();
    return amount === undefined ? "0" : amount;
  }

  public getAllValidatorsAddresses(): IterableIterator<string> {
    return this.rewards.keys();
  }

  public getTotalRewardsViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getViewDenom(config.stakingDenom);
  }

  public getTotalRewardsViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.totalRewards, config.stakingDenom, precision);
  }

  public getTotalRewardsViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.totalRewards, config.stakingDenom, precision);
  }

}
