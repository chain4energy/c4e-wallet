export interface Account {
  "@type": string,

}

export interface BaseAccount {
  address: string,
  pub_key: {
    "@type": string,
    key: string
  },
  account_number: string,
  sequence: string
}

export interface ContinuousVestingAccount {
  base_vesting_account: {
    base_account: BaseAccount,
    original_vesting?: [
      {
        denom: string,
        amount: string
      }
    ],
    delegated_free: [],
    delegated_vesting: [
      {
        denom: string,
        amount: string
      }
    ],
    end_time: string
  },
  start_time: string
}

export interface AccountResponse {
  account: Account
}

export interface BalanceResponse {
  balance: Balance,
}

export interface Balance {
  denom: string,
  amount: string
}
