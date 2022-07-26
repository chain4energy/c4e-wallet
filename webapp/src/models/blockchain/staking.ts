import { Coin } from "./common"
import { PaginatedResponse } from "./pagination"

export interface DelegationsResponse extends PaginatedResponse {
  delegation_responses: Delegation[]
}

export interface Delegation {
  delegation: {
    delegator_address: string,
    validator_address: string,
    shares: string
  },
  balance: Coin
}

export interface UnbondigDelegationsResponse extends PaginatedResponse {
  unbonding_responses: UnbondigDelegation[]
}

export interface UnbondigDelegation {
  delegator_address: string,
  validator_address: string,
  entries: [
    {
      creation_height: string,
      completion_time: string,
      initial_balance: string,
      balance: string
    }
  ]
}
