import {Currency} from "@/models/currency";

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
  currency: Currency;

  constructor(price: number, timestamp: Date, currency: Currency) {
    this.price = price;
    this.timestamp = timestamp;
    this.currency = currency;
  }
}

