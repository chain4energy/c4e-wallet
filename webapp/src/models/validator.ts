export interface validatorsComponent{
  fullList: Array<Validator>
  activeList: Array<Validator>
  notActive: Array<Validator>
  stacked: Array<Validator>
}

export interface Validator{
  id: number
  commission:object
  consensus_pubkey:object
  delegator_shares:string
  description:object
  jailed:boolean
  min_self_delegation:string
  operator_address:string
  status:string | number
  tokens:string
  unbonding_height:string
  unbonding_time:string
  votingPower: number
  userTouched: boolean
  rewards: BasicQuantity
  stacked: BasicQuantity
}
export interface BasicQuantity{
  denom: string,
  amount: string
}
export interface rewards{
  reward: Array<BasicQuantity>,
  validator_address: string
}
export interface rewards{
  reward: Array<BasicQuantity>,
  // eslint-disable-next-line camelcase
  validator_address: string
}
export interface Rewards{
  rewards: Array<rewards>,
  total: Array<BasicQuantity>
}
