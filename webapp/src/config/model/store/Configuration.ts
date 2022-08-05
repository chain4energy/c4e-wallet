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
  stakingPageURL: string;
  addressPrefix: string;
  stakingDenom: string;
  strategicPoolAddress: string;
  airdropPoolAddress: string;
  chainId: string;
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
  testFileName?: string;
  public static readonly emptyConfiguration = new Configuration();

  constructor (
    configuration?: JsonConfiguration | undefined
  ) {
    if (configuration) {
      this.bcApiURL = configuration.bcApiURL;
      this.bcRpcURL = configuration.bcRpcURL;
      this.hasuraURL = configuration.hasuraURL;
      this.stakingPageURL = configuration.stakingPageURL;
      this.addressPrefix = configuration.addressPrefix;
      this.stakingDenom = configuration.stakingDenom;
      this.strategicPoolAddress = configuration.strategicPoolAddress;
      this.airdropPoolAddress = configuration.airdropPoolAddress;
      this.chainId = configuration.chainId;
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
      this.isEmpty = false;
      this.testMode = configuration.testMode ? configuration.testMode : false;
      this.testFileName = configuration.testFileName;
    } else {
      this.bcApiURL = '';
      this.bcRpcURL = '';
      this.hasuraURL = '';
      this.stakingPageURL = '';
      this.addressPrefix = '';
      this.stakingDenom = '';
      this.strategicPoolAddress = '';
      this.airdropPoolAddress = '';
      this.chainId = '';
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

  public getViewDenom(origDenom = this.stakingDenom): string {
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

  public getViewAmount(origAmount: bigint | number | BigDecimal, precision = 4, reduceBigNumber = false, origDenom = this.stakingDenom): string {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    let result: number | BigDecimal;
    if (viewDenomConf) {
      if (typeof origAmount === 'bigint') {
        result = this.toViewAmount(origAmount, viewDenomConf.conversionFactor, precision);
      } else if (typeof origAmount === 'number') {
        result = (origAmount / viewDenomConf.conversionFactor);
      } else {
        result = origAmount.divide( viewDenomConf.conversionFactor);
      } 
    } else {
      if (typeof origAmount === 'bigint') {
        result = new BigDecimal(origAmount);
      } else {
        result = origAmount;
      }
    }
    if (reduceBigNumber) {
      return this.bigNumbersView(result, precision);
    }
    return result.toFixed(precision);
  }

  private bigNumbersView(number: bigint | number | BigDecimal, precision: number): string {
    let val: BigDecimal;
    if (number instanceof BigDecimal) {
      val = number;
    } else {
      val = new BigDecimal(number);
    }
  
    let suffix = ''
    if (val.isBiggerThanOrEqualTo(1e12)) {
      val = val.divide(1e12);
      suffix = 'T';
    } else if (val.isBiggerThanOrEqualTo(1e9)) {
      val = val.divide(1e9);
      suffix = 'B';
    } else if (val.isBiggerThanOrEqualTo(1e6)) {
      val = val.divide(1e6);
      suffix = 'M';
    } else if (val.isBiggerThanOrEqualTo(1e3)) {
      val = val.divide(1e3);
      suffix = 'k';
    } 
    return val.toFixed(precision) + (suffix !== '' ? ` ${suffix}` : '');
  }

  public getViewAmountAndDenom(origAmount: bigint | number | BigDecimal, precision = 4, origDenom = this.stakingDenom): { amount: string, denom: string } {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      const denom = viewDenomConf.viewDenom;
      let amount: string;
      if (typeof origAmount === 'bigint') {
        amount = this.toViewAmount(origAmount, viewDenomConf.conversionFactor, precision).toFixed(precision);
      } else if (typeof origAmount === 'number') {
        amount = (origAmount / viewDenomConf.conversionFactor).toFixed(precision);
      } else {
        amount = origAmount.divide( viewDenomConf.conversionFactor).toFixed(precision);
      } 
      return {amount: amount, denom: denom};
    }
    if (typeof origAmount === 'bigint') {
      return  { amount: this.bigIntToFixed(origAmount, precision), denom: origDenom };
    } else {
      return { amount: origAmount.toFixed(precision), denom: origDenom };
    }
  }

  private toViewAmount(origAmount: bigint, conversionFactor: number, precision: number): BigDecimal {
    const helperValue = Math.pow(10, precision);
    const helperValueBigInt = BigInt(helperValue);
    const amount = origAmount * helperValueBigInt / BigInt(conversionFactor);
    return divideBigInts(amount, BigInt(helperValue));
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
