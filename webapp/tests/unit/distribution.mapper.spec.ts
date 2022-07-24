
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { defaultDelegatorDelegationsValidators } from '../utils/staking.blockchain.data.util';
import { createRewards, createRewardsResponseData, defaultRewardsCoins, defaultRewardsValidators, expectRewards, findRewardsByValidator, findTotalRewards } from '../utils/distribution.blockchain.data.util';
import { mapReward, mapRewards } from "@/models/mapper/distribution.mapper";
import { Reward, RewardsResponse } from "@/models/blockchain/distribution";
import { setActivePinia, createPinia } from 'pinia'
import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal } from "@/models/store/big.decimal";

const validatorAddress = defaultDelegatorDelegationsValidators[0];

describe('tests mapping of staking related data', () => {

  it('maps undefined reward', async () => {
    expect(() => {mapReward(undefined)}).toThrowError(new Error(`Reward is undefined`))
  });

  it('maps reward', async () => {
    const rewardCoins = defaultRewardsCoins[0]
    const bcReward = createRewards([validatorAddress], [rewardCoins])[0];
    const storeReward = mapReward(bcReward);

    expect(storeReward.rewards.length).toBe(rewardCoins.length);
    for (let i = 0; i < rewardCoins.length; i++) {
      expect(storeReward.rewards[i].amount).toStrictEqual(new BigDecimal(rewardCoins[i].amount));
      expect(storeReward.rewards[i].denom).toBe(rewardCoins[i].denom);
    }
    expect(storeReward.validatorAddress).toBe(validatorAddress);    
  });

  it('maps undefined rewards response', async () => {
    expect(() => {mapRewards(undefined)}).toThrowError(new Error(`RewardsResponse list is undefined`))
  });

  it('maps rewards response with undefined rewards', async () => {
    const bcRewards = { rewards: undefined, total: new Array<{ denom: string, amount: string }>() } as unknown as RewardsResponse
    expect(() => {mapRewards(bcRewards)}).toThrowError(new Error(`Reward list is undefined`))
  });

  it('maps rewards response with undefined total', async () => {
    const bcRewards = { rewards: new Array<Reward>(), total: undefined } as unknown as RewardsResponse
    expect(() => {mapRewards(bcRewards)}).toThrowError(new Error(`Total rewards list is undefined`))
  });

  it('maps rewards', async () => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = defaultDenom;

    const bcRewardsData = createRewardsResponseData() as RewardsResponse;
    const storeReward = mapRewards(bcRewardsData);

    expectRewards(storeReward);

    // expect(storeReward.rewards.size).toBe(defaultRewardsValidators.length);
    // expect(storeReward.totalRewards).toBe(Number(findTotalRewards(defaultDenom).amount));
    // defaultRewardsValidators.forEach(validatorAddress => {
    //   const reward = storeReward.rewards.get(validatorAddress);
    //   const expectedReward = findRewardsByValidator(validatorAddress);
    //   expect(reward?.rewards.length).toBe(expectedReward.length);
    //   for (let i = 0; i < expectedReward.length; i++) {
    //     expect(reward?.rewards[i].amount).toBe(expectedReward[i].amount);
    //     expect(reward?.rewards[i].denom).toBe(expectedReward[i].denom);
    //   }
    //   expect(reward?.validatorAddress).toBe(validatorAddress);
    // });

  });

});