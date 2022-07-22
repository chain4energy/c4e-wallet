export class Coin {
  amount: bigint;
  denom: string;

  constructor (amount: bigint, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }
}

export class DecCoin {
  amount: string;
  denom: string;

  constructor (amount: string, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }
}