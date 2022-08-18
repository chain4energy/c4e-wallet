import { useConfigurationStore } from "@/store/configuration.store";

export class Delegation {
  validatorAddress: string;
  amount: bigint; // TODO Amount as Coin ??

  constructor (validatorAddress: string, amount: bigint) {
    this.validatorAddress = validatorAddress;
    this.amount = amount;
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
  completionTime: Date;

  constructor (amount: bigint, completionTime: Date) {
    this.amount = amount;
    this.completionTime = completionTime;
  }

  public getCompletionTimeDate(): Date {
    return this.completionTime;
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
}
