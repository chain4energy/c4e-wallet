import { Reward, RewardsResponse,} from "@/models/blockchain/distribution";
import { ValidatorRewards, Rewards} from "@/models/store/distribution";
import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal } from "../store/big.decimal";
import { DecCoin } from "../store/common";

export function mapRewards(rewardsResponse: RewardsResponse | undefined): Rewards  {
  if (rewardsResponse === undefined) {
    throw new Error('RewardsResponse list is undefined');
  }

  if (rewardsResponse.rewards === undefined) {
    throw new Error('Reward list is undefined');
  }

  if (rewardsResponse.total === undefined) {
    throw new Error('Total rewards list is undefined');
  }

  const map = new Map<string, ValidatorRewards>();
  rewardsResponse.rewards.forEach(rew => {
    map.set(rew.validator_address, mapReward(rew));
  });
  const denom = useConfigurationStore().config.stakingDenom;
  console.log('dsaasdsasa: ' + JSON.stringify(rewardsResponse.total))
  console.log('dsaasdsasa: ' + denom)
  const total = rewardsResponse.total.find(val => val.denom === denom)?.amount;
  // TODO to big decimal
  return new Rewards(map, total === undefined ? new BigDecimal(0) : new BigDecimal(total));
}

export function mapReward(reward: Reward | undefined): ValidatorRewards  {
  if (reward === undefined) {
      throw new Error('Reward is undefined');
  }
  const coins = Array<DecCoin>();
  reward.reward.forEach(coin => coins.push(new DecCoin(new BigDecimal(coin.amount), coin.denom)));
  return new ValidatorRewards(reward.validator_address, coins);
}


