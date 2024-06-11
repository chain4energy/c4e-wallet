export interface LoyaltyDropPoolConfigResponse {
  id: number,
  pool_description: string,
  vesting_type_name:	string,
  base_tokens:	number,
  used_tokens:	number,
  reserved_tokens: number,
  rewards_tokens:	number,
  granted_rewards: number,
  epoch_number: number,
  epoch_period: number,
  epoch_start_date: string
}

export interface LoyaltyDropUserBoostResponse {
  id:number,
  boost_pool_id:number,
  vesting_pool_name: string
  base_account_address: string,
  status: UserBoostStatusType,
  tx_hash:  string,
  granted_rewards: number | null,
  amount: number,
  last_reward_date: string | null,
  lock_start: string | null,
  lock_end: string | null,
 }


export enum UserBoostStatusType{
  TRANSACTION_IN_PROGRESS = 'TRANSACTION_IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
