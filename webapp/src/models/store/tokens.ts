import { useConfigurationStore } from "@/store/configuration.store";

export class StakingPool {
  bondedTokens: bigint;
  notBondedTokens: bigint;

  constructor (bondedTokens: bigint, notBondedTokens: bigint) {
    this.bondedTokens = bondedTokens;
    this.notBondedTokens = notBondedTokens;
  }

  public getViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getConvertedDenom(config.stakingDenom);
  }

  public getBondedTokensViewAmount(precision = 4): string {
    return useConfigurationStore().config.getViewAmount(this.bondedTokens, precision);
  }

  public getNotBondedTokensViewAmount(precision = 4): string {
    return useConfigurationStore().config.getViewAmount(this.notBondedTokens, precision);
  }

  public getBondedTokensViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.bondedTokens, precision);
  }

  public getNotBondedTokensViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    return useConfigurationStore().config.getViewAmountAndDenom(this.notBondedTokens, precision);
  }
}
