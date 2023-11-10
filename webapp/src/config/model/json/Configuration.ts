import {QueriesEv} from "@/config/model/store/Configuration";


export interface Gas {
  vote: number,
  delegate: number,
  undelegate: number,
  redelegate: number,
  claimRewards: number,
  transfer: number
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

export interface JsonQueries {
  STAKING_POOL_URL: string;
  TOTAL_SUPPLY_URL: string;
  COMMUNITY_POOL_URL: string;
  PROPOSALS_URL: string;
  PROPOSALS_BY_ID_URL: string;
  TALLYING_URL: string;
  DEPOSIT_URL: string;
  LATEST_BLOCK_URL: string;
  VALIDATORS_URL: string;
  ACCOUNT_URL: string;
  BALANCE_URL: string;
  STAKED_AMOUNT_URL: string;
  UNSTAKED_AMOUNT_URL: string;
  REWARDS_URL: string;
  PROPOSAL_TALLY_URL: string;
  INFLATION_URL: string;
  STAKING_PARAMS_URL: string;
  VESTINGS_SUM_URL: string;
  DISTRIBUTOR_PARAMS_URL: string;
  USER_AIRDROP_ENTRIES_URL: string;
  CAMPAIGNS_URL: string;
  MISSIONS_URL: string;
  AIRDROP_DISTRIBUTIONS: string;
  AIRDROP_CLAIMS_LEFT: string;
  SPENDABLE_BALANCES_URL: string;
}

export interface JsonQueriesEv{
  LOGIN_EMAIL_AND_LOGIN_DATA: string;
  DECODE_RESOURCE_URL: string;
}

export interface Configuration {
  bcApiURL: string,
  bcRpcURL: string,
  hasuraURL: string,
  keybaseURL: string,
  stakingPageURL: string,
  publicSaleServiceURL: string,
  evServiceURL: string,
  addressPrefix: string,
  stakingDenom: string,
  strategicPoolAddress: string[],
  airdropPoolAddress: string,
  chainId: string,
  networkName: string,
  keplrNetworkName: string,
  operationGas: Gas,
  viewDenoms: ViewDenom[],
  keplrGasPriceSteps: KeplrGasPriceSteps;
  reservedCoinsAmount: number,
  minPeriodBetweenDataRefresh: number,
  blockDataRefreshTimeout: number,
  dashboardDataRefreshTimeout: number,
  validatorsDataRefreshTimeout: number,
  accountDataRefreshTimeout: number,
  proposalsPageLimit: number,
  queries: JsonQueries;
  queriesEv: QueriesEv;
  explorerUrl: string,
  explorerAccount: string,
  explorerTx: string,
  isMainNetwork: boolean,
  testMode?: boolean,
  testFileName?: string,
  airdropBaseURL: string;
  proposalVotingRefreshTimeout: number;
  airdropDefaultDenom: string;
  targetInflationAprMultiplier: number;
  faucetURL: string;
  faucetAvailable: boolean;
  tokenReservationDenom: string;
  currentPublicSaleRoundId: number;
  transferDenom: string;
  publicSaleVisible: boolean;
}
