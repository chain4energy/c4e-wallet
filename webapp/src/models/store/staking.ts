export class Delegation {
  validatorAddress: string;
  amount: string;

  constructor (validatorAddress: string, amount: string) {
    this.validatorAddress = validatorAddress;
    this.amount = amount;
  }
}

export class Delegations {
  delegations: Map<string, Delegation>;
  totalDelegated: number;

  constructor (delegations = new Map<string, Delegation>(), totalDelegated = 0) {
    this.delegations = delegations;
    this.totalDelegated = totalDelegated;
  }

  public getAmountByValidator(validatorAddress: string): string {
    const amount = this.delegations.get(validatorAddress)?.amount;
    return amount === undefined ? "0" : amount;
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
  amount: string;

  constructor (amount: string) {
    this.amount = amount;
  }
}

export class UnbondingDelegations {
  undelegations: Map<string, UnbondingDelegation>;
  totalUndelegating: number;

  constructor (undelegations = new Map<string, UnbondingDelegation>(), totalUndelegating = 0) {
    this.undelegations = undelegations;
    this.totalUndelegating = totalUndelegating;
  }

  public getAmountByValidator(validatorAddress: string): number {
    let amount = 0;
    this.undelegations.get(validatorAddress)?.entries.forEach(a => amount += Number(a.amount));
    return amount;
  }

}