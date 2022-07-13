import { Pagination } from "./pagination"

export interface DelegationsResponse{
  delegation_responses: Delegation[]
  pagination: Pagination
}

export interface Delegation {
  delegation: {
    delegator_address: string,
    validator_address: string,
    shares: string
  },
  balance: {
    denom: string,
    amount: string
  }
}

export interface UnbondigDelegationsResponse{
  unbonding_responses: UnbondigDelegation[]
  pagination: Pagination
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

