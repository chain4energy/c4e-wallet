export interface LoyaltyDropPoolConfigResponse {
  id: number,
  pool_description: string,
  prefix_name: string,
  vesting_type_name:	string,
  base_tokens:	number,
  used_tokens:	number,
  reserved_tokens: number,
  rewards_tokens:	number,
  epoch_number: number,
  epoch_period: number,
  epoch_start_date: string,
  apr: number
}

export interface LoyaltyDropUserBoostResponse {
  base_account_address: string,
  boost_pool_id:number,
  granted_rewards:number,
  id:number,
  last_reward_date:string,
  status: string,
  tx_hash:  string,
  vesting_pool_name: string
}
