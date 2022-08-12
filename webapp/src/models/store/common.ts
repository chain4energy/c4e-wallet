import { useConfigurationStore } from "@/store/configuration.store";
import { BigDecimal } from '@/models/store/big.decimal';

export class Coin {
  amount: bigint;
  denom: string;

  constructor(amount: bigint, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }

  public getViewDenom(): string {
    return useConfigurationStore().config.getConvertedDenom(this.denom);
  }

  public getViewAmount(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.amount, precision, reduceBigNumber, this.denom);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.amount, precision, this.denom);
  }

}

export class DecCoin {
  amount: BigDecimal;
  denom: string;

  constructor(amount: BigDecimal, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }

  public getViewDenom(): string {
    return useConfigurationStore().config.getConvertedDenom(this.denom);
  }

  public getViewAmount(precision = 4, reduceBigNumber = false): string {
    return useConfigurationStore().config.getViewAmount(this.amount, precision, reduceBigNumber, this.denom);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.amount, precision, this.denom);
  }
}

export function toPercentage(num: BigDecimal | number, precision = 4): string {
  if (typeof num === 'number') {
    if (isNaN(num)) {
      return Number.NaN.toString();
    }
    return (num * 100).toFixed(precision);
  } else {
    return num.multiply(100).toFixed(precision);
  }
}

export function findByDenom(coins: Coin[], denom: string): Coin {
  const result = coins.find(coin => coin.denom === denom);
  return result === undefined ? new Coin(0n, denom) : result;
}