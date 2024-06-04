export class StakingPool {
  bondedTokens: bigint;
  notBondedTokens: bigint;

  constructor (bondedTokens: bigint, notBondedTokens: bigint) {
    this.bondedTokens = bondedTokens;
    this.notBondedTokens = notBondedTokens;
  }

}

export class TokenPrice {
  price: number;
  timestamp: Date;

  constructor(price: number, timestamp: Date) {
    this.price = price;
    this.timestamp = timestamp;
  }
}

