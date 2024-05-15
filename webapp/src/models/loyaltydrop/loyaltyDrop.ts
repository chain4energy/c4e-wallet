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
  id:number,
  boost_pool_id:number,
  vesting_pool_name: string
  base_account_address: string,
  status: UserBoostStatusType,
  tx_hash:  string,
  granted_rewards:number,
  amount: number,
  last_reward_date:string,
  lock_start: string,
  lock_end: string
 }


export enum UserBoostStatusType{
  TRANSACTION_IN_PROGRESS = 'TRANSACTION_IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
