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
    return useConfigurationStore().config.getViewDenom(this.denom);
  }

  public getViewAmount(precision = 4): string {
    return useConfigurationStore().config.getViewAmount(this.amount, this.denom, precision);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.amount, this.denom, precision);
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
    return useConfigurationStore().config.getViewDenom(this.denom);
  }

  public getViewAmount(precision = 4): string {
    return useConfigurationStore().config.getViewAmount(this.amount, this.denom, precision);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.amount, this.denom, precision);
  }
}

export function toPercentage(num: BigDecimal | number, precision = 4): string {
  if (typeof num === 'number') {
    return (num * 100).toFixed(precision) + '%';
  } else {
    return num.multiply(100).toFixed(precision) + '%';
  }
}