export interface HasuraVestingAccountsRespone {
  data: VestingAccounts
}

export interface VestingAccounts {
  vesting_account: VestingAccount[]
}

export interface VestingAccount {
  start_time: string,
  end_time: string,
  original_vesting: CoinVesting[]
}

export interface CoinVesting {
  denom: string,
  amount: bigint
}
