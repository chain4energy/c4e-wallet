import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal } from "./big.decimal";
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
    return result === undefined ? new DecCoin(new BigDecimal(0), denom) : result;
  }
}

export class Rewards {
  rewards: Map<string, ValidatorRewards>;
  totalRewards: BigDecimal; 

  constructor (rewards = new Map<string, ValidatorRewards>(), totalRewards = new BigDecimal(0)) {
    this.rewards = rewards;
    this.totalRewards = totalRewards;
  }

  public getAmountByValidator(validatorAddress: string): BigDecimal {
    const amount = this.rewards.get(validatorAddress)?.getByDenom(useConfigurationStore().config.stakingDenom).amount;
    return amount === undefined ? new BigDecimal(0) : amount;
  }

  public getAllValidatorsAddresses(): IterableIterator<string> {
    return this.rewards.keys();
  }

}
