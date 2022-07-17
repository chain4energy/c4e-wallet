import { defaultDenom } from "./common.blockchain.data.util";

export const defaultRewardsValidators = [
  'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
  'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5'
]

export const defaultRewardsCoins = [
  [
    {
      denom: defaultDenom,
      amount: '94674698.350135527836087568'
    }
  ],
  [
    {
      denom: defaultDenom,
      amount: '94774371.034393892953000000'
    }
  ]
];

export const defaultRewardsTotal = [
  {
    denom: defaultDenom,
    amount: '701806492.986585310106087069'
  }
];

export function findTotalRewards(denom = defaultDenom,
  rewardsCoins = defaultRewardsTotal) {
  for (let i = 0; i < rewardsCoins.length; i++) {
    if (rewardsCoins[i].denom === denom) {
      return rewardsCoins[i];
    }
  }
  throw new Error('rewardsCoins for denom: ' + denom + ' not found')
}

export function findRewardsByValidator(validatorAddress: string,
  validators = defaultRewardsValidators,
  rewardsCoins = defaultRewardsCoins) {
  if (validators.length !== rewardsCoins.length) {
    throw new Error('validators.length !== rewardsCoins.length')
  } 
  for (let i = 0; i < validators.length; i++) {
    if (validators[i] === validatorAddress) {
      return rewardsCoins[i];
    }
  }
  throw new Error('rewardsCoins not found')
}

export function createRewardsResponseData(validators = defaultRewardsValidators, rewards = defaultRewardsCoins, total = defaultRewardsTotal) {
  return {
    rewards: createRewards(validators, rewards),
    total: total
  }
}

export function createRewards(validators = defaultRewardsValidators, rewards = defaultRewardsCoins) {
  if (validators.length !== rewards.length) {
    throw new Error('validators.length !== rewards.length')
  }
  const rewardsArray = new Array()
  for (let i = 0; i < validators.length; i++) {
    rewardsArray.push({
      validator_address: validators[i],
      reward: rewards[i]
    })
  }
  return rewardsArray;
}
