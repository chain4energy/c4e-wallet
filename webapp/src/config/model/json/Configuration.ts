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
  keybaseURL: string,
  stakingPageURL: string,
  addressPrefix: string,
  stakingDenom: string,
  strategicPoolAddress: string,
  airdropPoolAddress: string,
  chainId: string,
  operationGas: Gas,
  viewDenoms: ViewDenom[],
  keplrGasPriceSteps: KeplrGasPriceSteps;
  minPeriodBetweenDataRefresh: number,
  blockDataRefreshTimeout: number,
  dashboardDataRefreshTimeout: number,
  validatorsDataRefreshTimeout: number,
  accountDataRefreshTimeout: number,
  proposalsPageLimit: number
  testMode?: boolean,
  testFileName?: string,

}
