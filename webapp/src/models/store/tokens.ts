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
    return config.getViewDenom(config.stakingDenom);
  }

  public getBondedTokensViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.bondedTokens, config.stakingDenom, precision);
  }

  public getNotBondedTokensViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.notBondedTokens, config.stakingDenom, precision);
  }

  public getBondedTokensViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.bondedTokens, config.stakingDenom, precision);
  }

  public getNotBondedTokensViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.notBondedTokens, config.stakingDenom, precision);
  }
}
