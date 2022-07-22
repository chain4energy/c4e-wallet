export interface Gas {
  vote: number,
  delegate: number,
  undelegate: number,
  redelegate: number,
  claimRewards: number,
}

export interface ViewDenom {
  denom: string,
  viewDenom: string,
  conversionFactor: number,
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
  chainId: string,
  operationGas: Gas,
  viewDenoms: ViewDenom[],
}
