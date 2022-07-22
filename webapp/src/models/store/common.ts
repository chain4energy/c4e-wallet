import { useConfigurationStore } from "@/store/configuration.store";

export class Coin {
  amount: bigint;
  denom: string;

  constructor (amount: bigint, denom: string) {
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
  amount: string;
  denom: string;

  constructor (amount: string, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }

  public getViewDenom(): string {
    return useConfigurationStore().config.getViewDenom(this.denom);
  }

  public getViewAmount(precision = 4): string {
    return useConfigurationStore().config.getViewAmount(Number(this.amount), this.denom, precision);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(Number(this.amount), this.denom, precision);
  }
}