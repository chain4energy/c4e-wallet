import { useConfigurationStore } from "@/store/configuration.store";

export class Delegation {
  validatorAddress: string;
  amount: bigint; // TODO Amount as Coin ??

  constructor (validatorAddress: string, amount: bigint) {
    this.validatorAddress = validatorAddress;
    this.amount = amount;
  }

  public getViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getViewDenom(config.stakingDenom);
  }

  public getViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.amount, config.stakingDenom, precision);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.amount, config.stakingDenom, precision);
  }
}

export class Delegations {
  delegations: Map<string, Delegation>;
  totalDelegated: bigint;

  constructor (delegations = new Map<string, Delegation>(), totalDelegated = 0n) {
    this.delegations = delegations;
    this.totalDelegated = totalDelegated;
  }

  public getAmountByValidator(validatorAddress: string): bigint {
    const amount = this.delegations.get(validatorAddress)?.amount;
    return amount === undefined ? 0n : amount;
  }

  public getViewAmountByValidator(validatorAddress: string, precision = 4): string {
    const amount = this.delegations.get(validatorAddress)?.getViewAmount(precision);
    return amount === undefined ? "0" : amount;
  }

  public getTotalDelegatedViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getViewDenom(config.stakingDenom);
  }

  public getTotalDelegatedViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.totalDelegated, config.stakingDenom, precision);
  }

  public getTotalDelegatedViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.totalDelegated, config.stakingDenom, precision);
  }

}

export class UnbondingDelegation {
  validatorAddress: string;
  entries: UnbondingDelegationEntry[];

  constructor (validatorAddress: string, entries: UnbondingDelegationEntry[]) {
    this.validatorAddress = validatorAddress;
    this.entries = entries;
  }
}

export class UnbondingDelegationEntry {
  amount: bigint;

  constructor (amount: bigint) {
    this.amount = amount;
  }

  public getViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getViewDenom(config.stakingDenom);
  }

  public getViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.amount, config.stakingDenom, precision);
  }

  public getViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.amount, config.stakingDenom, precision);
  }
}

export class UnbondingDelegations {
  undelegations: Map<string, UnbondingDelegation>;
  totalUndelegating: bigint;

  constructor (undelegations = new Map<string, UnbondingDelegation>(), totalUndelegating = 0n) {
    this.undelegations = undelegations;
    this.totalUndelegating = totalUndelegating;
  }

  public getAmountByValidator(validatorAddress: string): bigint {
    let amount = 0n;
    this.undelegations.get(validatorAddress)?.entries.forEach(a => amount += a.amount);
    return amount;
  }

  public getViewAmountByValidator(validatorAddress: string, precision = 4): string {
    let amount = 0n;
    this.undelegations.get(validatorAddress)?.entries.forEach(a => amount += a.amount);
    const config = useConfigurationStore().config;
    return config.getViewAmount(amount, config.stakingDenom, precision);
  }

  public getTotalUndelegatingViewDenom(): string {
    const config = useConfigurationStore().config;
    return config.getViewDenom(config.stakingDenom);
  }

  public getTotalUndelegatingViewAmount(precision = 4): string {
    const config = useConfigurationStore().config;
    return config.getViewAmount(this.totalUndelegating, config.stakingDenom, precision);
  }

  public getTotalUndelegatingViewAmountAndDenom(precision = 4): { amount: string, denom: string } {
    const config = useConfigurationStore().config;
    return config.getViewAmountAndDenom(this.totalUndelegating, config.stakingDenom, precision);
  }

}
