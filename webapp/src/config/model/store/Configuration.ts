import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";
import {
  Gas as JsonGas,
  ViewDenom as JsonViewDenom,
  Configuration as JsonConfiguration,
  KeplrGasPriceSteps as JsonKeplrGasPriceSteps,
  JsonQueries
} from "../json/Configuration";
export class Gas implements JsonGas {
  vote: number;
  delegate: number;
  undelegate: number;
  redelegate: number;
  claimRewards: number;

  constructor (
    gas: JsonGas | undefined
  ) {
    if (gas) {
      this.vote = gas.vote;
      this.delegate = gas.delegate;
      this.undelegate = gas.undelegate;
      this.redelegate = gas.redelegate;
      this.claimRewards = gas.claimRewards;
    } else {
      this.vote = 0;
      this.delegate = 0;
      this.undelegate = 0;
      this.redelegate = 0;
      this.claimRewards = 0;
    }
  }

}

export class ViewDenom implements JsonViewDenom {
  denom: string;
  viewDenom: string;
  coinDecimals: number;
  conversionFactor: number;

  constructor (
    viewDenom: JsonViewDenom
  ) {
    this.denom = viewDenom.denom;
    this.viewDenom = viewDenom.viewDenom;
    this.coinDecimals = viewDenom.coinDecimals;
    this.conversionFactor = Math.pow(10, this.coinDecimals);
  }
}

export class KeplrGasPriceSteps implements JsonKeplrGasPriceSteps{
  low: number;
  average: number;
  high: number;

  constructor (
    gasPriceSteps: JsonKeplrGasPriceSteps | undefined
  ) {
    if (gasPriceSteps) {
      this.low = gasPriceSteps.low;
      this.average = gasPriceSteps.average;
      this.high = gasPriceSteps.high;
    } else {
      this.low = 0;
      this.average = 0;
      this.high = 0;
    }
  }
}

export class Queries implements JsonQueries{
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
  constructor (
    queries : JsonQueries | undefined
  ){
    if(queries){
      this.STAKING_POOL_URL = queries.STAKING_POOL_URL;
      this.TOTAL_SUPPLY_URL = queries.TOTAL_SUPPLY_URL;
      this.COMMUNITY_POOL_URL = queries.COMMUNITY_POOL_URL;
      this.PROPOSALS_URL = queries.PROPOSALS_URL;
      this.PROPOSALS_BY_ID_URL = queries.PROPOSALS_BY_ID_URL;
      this.TALLYING_URL = queries.TALLYING_URL;
      this.DEPOSIT_URL = queries.DEPOSIT_URL;
      this.LATEST_BLOCK_URL = queries.LATEST_BLOCK_URL;
      this.VALIDATORS_URL = queries.VALIDATORS_URL;
      this.ACCOUNT_URL = queries.ACCOUNT_URL;
      this.BALANCE_URL = queries.BALANCE_URL;
      this.STAKED_AMOUNT_URL = queries.STAKED_AMOUNT_URL;
      this.UNSTAKED_AMOUNT_URL = queries.UNSTAKED_AMOUNT_URL;
      this.REWARDS_URL = queries.REWARDS_URL;
      this.PROPOSAL_TALLY_URL = queries.PROPOSAL_TALLY_URL;
      this.INFLATION_URL =queries.INFLATION_URL;
      this.STAKING_PARAMS_URL = queries.STAKING_PARAMS_URL;
      this.VESTINGS_SUM_URL = queries.VESTINGS_SUM_URL;
    } else {
      this.STAKING_POOL_URL = '';
      this.TOTAL_SUPPLY_URL = '';
      this.COMMUNITY_POOL_URL = '';
      this.PROPOSALS_URL = '';
      this.PROPOSALS_BY_ID_URL = '';
      this.TALLYING_URL = '';
      this.DEPOSIT_URL = '';
      this.LATEST_BLOCK_URL = '';
      this.VALIDATORS_URL = '';
      this.ACCOUNT_URL = '';
      this.BALANCE_URL = '';
      this.STAKED_AMOUNT_URL = '';
      this.UNSTAKED_AMOUNT_URL = '';
      this.REWARDS_URL = '';
      this.PROPOSAL_TALLY_URL = '';
      this.INFLATION_URL = '';
      this.STAKING_PARAMS_URL = '';
      this.VESTINGS_SUM_URL = '';
    }

  }
}

export class Configuration implements JsonConfiguration {
  bcApiURL: string;
  bcRpcURL: string;
  hasuraURL: string;
  keybaseURL: string;
  stakingPageURL: string;
  addressPrefix: string;
  stakingDenom: string;
  strategicPoolAddress: string;
  airdropPoolAddress: string;
  chainId: string;
  networkName: string;
  keplrNetworkName: string;
  operationGas: Gas;
  viewDenoms: ViewDenom[];
  isEmpty: boolean;
  testMode: boolean;
  keplrGasPriceSteps: KeplrGasPriceSteps;
  reservedCoinsAmount: number;
  minPeriodBetweenDataRefresh: number;
  blockDataRefreshTimeout: number;
  dashboardDataRefreshTimeout: number;
  validatorsDataRefreshTimeout: number;
  accountDataRefreshTimeout: number;
  proposalsPageLimit: number;
  queries: Queries;
  explorerUrl: string;
  explorerAccount: string;
  explorerTx: string;
  isMainNetwork: boolean;
  testFileName?: string;
  airdropBaseURL: string;
  proposalVotingRefreshTimeout: number;
  public static readonly emptyConfiguration = new Configuration();

  constructor (
    configuration?: JsonConfiguration | undefined
  ) {
    if (configuration) {
      this.bcApiURL = configuration.bcApiURL;
      this.bcRpcURL = configuration.bcRpcURL;
      this.hasuraURL = configuration.hasuraURL;
      this.keybaseURL = configuration.keybaseURL;
      this.stakingPageURL = configuration.stakingPageURL;
      this.addressPrefix = configuration.addressPrefix;
      this.stakingDenom = configuration.stakingDenom;
      this.strategicPoolAddress = configuration.strategicPoolAddress;
      this.airdropPoolAddress = configuration.airdropPoolAddress;
      this.chainId = configuration.chainId;
      this.networkName = configuration.networkName;
      this.keplrNetworkName = configuration.keplrNetworkName;
      this.operationGas = new Gas(configuration.operationGas);
      const viewDenoms = Array<ViewDenom>();
      if (configuration.viewDenoms) {
        configuration.viewDenoms.forEach(d => {viewDenoms.push(new ViewDenom(d));});
      }
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(configuration.keplrGasPriceSteps);
      this.reservedCoinsAmount = configuration.reservedCoinsAmount;
      this.minPeriodBetweenDataRefresh = configuration.minPeriodBetweenDataRefresh;
      this.blockDataRefreshTimeout = configuration.blockDataRefreshTimeout;
      this.dashboardDataRefreshTimeout = configuration.dashboardDataRefreshTimeout;
      this.validatorsDataRefreshTimeout = configuration.validatorsDataRefreshTimeout;
      this.accountDataRefreshTimeout = configuration.accountDataRefreshTimeout;
      this.proposalsPageLimit = configuration.proposalsPageLimit;
      this.queries = new Queries(configuration.queries);
      this.explorerUrl = configuration.explorerUrl;
      this.explorerAccount = configuration.explorerAccount;
      this.explorerTx = configuration.explorerTx;
      this.isMainNetwork = configuration.isMainNetwork;
      this.isEmpty = false;
      this.testMode = configuration.testMode ? configuration.testMode : false;
      this.testFileName = configuration.testFileName;
      this.airdropBaseURL = configuration.airdropBaseURL;
      this.proposalVotingRefreshTimeout = configuration.proposalVotingRefreshTimeout;
    } else {
      this.bcApiURL = '';
      this.bcRpcURL = '';
      this.hasuraURL = '';
      this.keybaseURL = '';
      this.stakingPageURL = '';
      this.addressPrefix = '';
      this.stakingDenom = '';
      this.strategicPoolAddress = '';
      this.airdropPoolAddress = '';
      this.chainId = '';
      this.networkName = '',
      this.keplrNetworkName = '',
      this.operationGas = new Gas(undefined);
      const viewDenoms = Array<ViewDenom>();
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(undefined);
      this.reservedCoinsAmount = 0;
      this.minPeriodBetweenDataRefresh = 60000;
      this.blockDataRefreshTimeout = 60000;
      this.dashboardDataRefreshTimeout = 60000;
      this.validatorsDataRefreshTimeout = 60000;
      this.accountDataRefreshTimeout = 60000;
      this.proposalsPageLimit = 10;
      this.queries = new Queries(undefined);
      this.explorerUrl = '';
      this.explorerAccount = '';
      this.explorerTx = '';
      this.isMainNetwork = false;
      this.isEmpty = true;
      this.testMode = false;
      this.airdropBaseURL = '';
      this.proposalVotingRefreshTimeout = 30000;
    }
  }

  public getViewDenomDecimals(origDenom = this.stakingDenom): number {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      return viewDenomConf.coinDecimals;
    }
    return 0;
  }

  public getConvertedDenom(origDenom = this.stakingDenom): string {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      return viewDenomConf.viewDenom;
    }
    return origDenom;
  }

  public getViewDenomConversionFactor(origDenom = this.stakingDenom): number {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      return viewDenomConf.conversionFactor;
    }
    return 1;
  }

  public getGasPrise() {
    return this.keplrGasPriceSteps.average;
  }
  public getReservedCoinsAmount(){
    return this.reservedCoinsAmount;
  }

  public getConvertedAmount(origAmount: bigint | number | BigDecimal, origDenom = this.stakingDenom): number | BigDecimal {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    let amount: number | BigDecimal;
    if (viewDenomConf) {
      if (typeof origAmount === 'bigint') {
        amount = this.bigintToConvertedAmount(origAmount, viewDenomConf.conversionFactor);
      } else if (typeof origAmount === 'number') {
        amount = (origAmount / viewDenomConf.conversionFactor);
      } else {
        amount = origAmount.divide( viewDenomConf.conversionFactor);
      }
      return amount;
    }
    if (typeof origAmount === 'bigint') {
      return new BigDecimal(origAmount);
    }
    return origAmount;
  }

  private bigintToConvertedAmount(origAmount: bigint, conversionFactor: number): BigDecimal {
    // const helperValue = Math.pow(10, precision);
    // const helperValueBigInt = BigInt(helperValue);
    // const amount = origAmount * helperValueBigInt / BigInt(conversionFactor);
    return divideBigInts(origAmount, BigInt(conversionFactor));
  }

  private getViewDenomConfig(origDenom: string): ViewDenom | undefined {
    return this.viewDenoms.find(d => {return d.denom === origDenom;});
  }

  private bigIntToFixed(num: bigint, precision: number): string {
    if (precision <= 0) {
      return num.toString();
    } else {
      return num + '.' + '0'.repeat(precision);
    }
  }
}
