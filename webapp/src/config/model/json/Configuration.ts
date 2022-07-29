export interface Gas {
  vote: number,
  delegate: number,
  undelegate: number,
  redelegate: number,
  claimRewards: number,
}

export interface KeplrGasPriceSteps {
  low: number,
  average: number,
  high: number,
}

export interface ViewDenom {
  denom: string,
  viewDenom: string,
  coinDecimals: number,
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
  keplrGasPriceSteps: KeplrGasPriceSteps;
  testMode?: boolean,
  testFileName?: string,

}
