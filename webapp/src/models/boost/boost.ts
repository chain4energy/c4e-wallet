export interface BoostConfigResponse {
  id: number,
  pool_description: string,
  prefix_name: string,
  vesting_type_name:	string,
  base_tokens:	number,
  used_tokens:	number,
  reserved_tokens: number,
  rewards_tokens:	number,
  epoch_period: number,
  epoch_start_date: string,
  apr: number,
  lock_period: number
}
