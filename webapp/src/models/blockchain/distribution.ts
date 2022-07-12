export interface RewardsResponse{
  rewards: Reward[]
  total: [
    {
      denom: string,
      amount: string
    }
  ]
}

export interface Reward {
  validator_address: string,
  reward: [
    {
      denom: string,
      amount: string
    }
  ]
}

