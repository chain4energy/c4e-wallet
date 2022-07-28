import { BigDecimal, divideBigInts } from "@/models/store/big.decimal";
import { Gas as JsonGas, ViewDenom as JsonViewDenom, Configuration as JsonConfiguration } from "../json/Configuration";
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
  conversionFactor: number;

  constructor (
    viewDenom: JsonViewDenom
  ) {
    this.denom = viewDenom.denom;
    this.viewDenom = viewDenom.viewDenom;
    this.conversionFactor = viewDenom.conversionFactor;
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
      this.isEmpty = true;
      this.testMode = false;
    }
  }

  public getViewDenom(origDenom: string): string {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      return viewDenomConf.viewDenom;
    }
    return origDenom;
  }

  public getViewAmount(origAmount: bigint | number | BigDecimal, origDenom = this.stakingDenom, precision = 4): string {
    const viewDenomConf = this.getViewDenomConfig(origDenom);
    if (viewDenomConf) {
      if (typeof origAmount === 'bigint') {
        return this.toViewAmount(origAmount, viewDenomConf.conversionFactor, precision).toFixed(precision);
      } else if (typeof origAmount === 'number') {
        return (origAmount / viewDenomConf.conversionFactor).toFixed(precision);
      } else {
        return origAmount.divide( viewDenomConf.conversionFactor).toFixed(precision);
      } 
    }
    if (typeof origAmount === 'bigint') {
      return this.bigIntToFixed(origAmount, precision);
    } else {
      return origAmount.toFixed(precision);
    }
  }

  public getViewAmountAndDenom(origAmount: bigint | number | BigDecimal, origDenom: string, precision = 4): { amount: string, denom: string } {
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
