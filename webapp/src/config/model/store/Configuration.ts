import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";
import { Gas as JsonGas, ViewDenom as JsonViewDenom, Configuration as JsonConfiguration, KeplrGasPriceSteps as JsonKeplrGasPriceSteps } from "../json/Configuration";
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
  operationGas: Gas;
  viewDenoms: ViewDenom[];
  isEmpty: boolean;
  testMode: boolean;
  keplrGasPriceSteps: KeplrGasPriceSteps;
  minPeriodBetweenDataRefresh: number;
  blockDataRefreshTimeout: number;
  dashboardDataRefreshTimeout: number;
  validatorsDataRefreshTimeout: number;
  accountDataRefreshTimeout: number;
  proposalsPageLimit: number;
  explorerAccount: string;
  explorerTx: string;
  isMainNetwork: boolean;
  testFileName?: string;
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
      this.networkName = configuration.networkName,
      this.operationGas = new Gas(configuration.operationGas);
      const viewDenoms = Array<ViewDenom>();
      if (configuration.viewDenoms) {
        configuration.viewDenoms.forEach(d => {viewDenoms.push(new ViewDenom(d))})
      }
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(configuration.keplrGasPriceSteps);
      this.minPeriodBetweenDataRefresh = configuration.minPeriodBetweenDataRefresh;
      this.blockDataRefreshTimeout = configuration.blockDataRefreshTimeout;
      this.dashboardDataRefreshTimeout = configuration.dashboardDataRefreshTimeout;
      this.validatorsDataRefreshTimeout = configuration.validatorsDataRefreshTimeout;
      this.accountDataRefreshTimeout = configuration.accountDataRefreshTimeout;
      this.proposalsPageLimit = configuration.proposalsPageLimit;
      this.explorerAccount = configuration.explorerAccount;
      this.explorerTx = configuration.explorerTx;
      this.isMainNetwork = configuration.isMainNetwork;
      this.isEmpty = false;
      this.testMode = configuration.testMode ? configuration.testMode : false;
      this.testFileName = configuration.testFileName;
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
      this.operationGas = new Gas(undefined);
      const viewDenoms = Array<ViewDenom>();
      this.viewDenoms = viewDenoms;
      this.keplrGasPriceSteps = new KeplrGasPriceSteps(undefined);
      this.minPeriodBetweenDataRefresh = 60000;
      this.blockDataRefreshTimeout = 60000;
      this.dashboardDataRefreshTimeout = 60000;
      this.validatorsDataRefreshTimeout = 60000;
      this.accountDataRefreshTimeout = 60000;
      this.proposalsPageLimit = 10;
      this.explorerAccount = '';
      this.explorerTx = '';
      this.isMainNetwork = false;
      this.isEmpty = true;
      this.testMode = false;
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
    console.log(origDenom);
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
    return this.viewDenoms.find(d => {return d.denom === origDenom});
  }

  private bigIntToFixed(num: bigint, precision: number): string {
    if (precision <= 0) {
      return num.toString();
    } else {
      return num + '.' + '0'.repeat(precision);
    }
  }
}
