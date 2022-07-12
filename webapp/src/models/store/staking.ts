export class Delegation {
  validatorAddress: string;
  amount: string;

  constructor (validatorAddress: string, amount: string) {
    this.validatorAddress = validatorAddress
    this.amount = amount
  }
}

export class Delegations {
  delegations: Map<string, Delegation>;
  totalDelegated: number;

  constructor (delegations: Map<string, Delegation>, totalDelegated: number) {
    this.delegations = delegations
    this.totalDelegated = totalDelegated
  }

  public getAmountByValidator(validatorAddress: string): string {
    const amount = this.delegations.get(validatorAddress)?.amount
    return amount === undefined ? "0" : amount
  }

}