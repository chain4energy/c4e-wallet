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

