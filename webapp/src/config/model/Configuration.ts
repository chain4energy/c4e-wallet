export interface Gas {
  vote: string,
  delegate: string,
  undelegate: string,
  redelegate: string,
  claimRewards: string,
}

export interface Configuration {
  bcApiURL: string,
  bcRpcURL: string,
  hasuraURL: string,
  stakingPageURL: string,
  addressPrefix: string,
  stakingDenom: string,
  strategicPoolAddress: string,
  airdropPoolAddress: string,
  coinConversion: string
  chainId: string
  operationGas: Gas
}
