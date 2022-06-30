import { BasicQuantity } from "@/models/validator";

export interface stackingList{
  delegation_responses: Array<stackItem>
  pagination:Object
}
export interface stackItem{
  balance: BasicQuantity
  delegation:delegation
}

export interface delegation{
  delegator_address: string
  shares: string
  validator_address: string
}
