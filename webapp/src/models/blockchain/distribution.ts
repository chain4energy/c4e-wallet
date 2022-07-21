import { Coin } from "./common"

export interface RewardsResponse{
  rewards: Reward[]
  total: Coin[]
}

export interface Reward {
  validator_address: string,
  reward: Coin[]
}

