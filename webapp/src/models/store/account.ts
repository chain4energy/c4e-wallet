import {Amount} from "@/models/TotalSupply";
import { array } from "yup";

export enum AccountType {
  BaseAccount,
  ContinuousVestingAccount,
  Unknown,
  Nonexistent
}

export class Account {
  type: AccountType;
  address: string;
  continuousVestingData?: ContinuousVestingData;

  constructor (type: AccountType, address: string) {
    this.type = type
    this.address = address
  }

}

export class ContinuousVestingData {
  startTime: string;
  endTime: string;
  originalVesting: Coin[];

  constructor (startTime: string, endTime: string, originalVesting: Coin[]) {
    this.startTime = startTime
    this.endTime = endTime
    this.originalVesting = originalVesting
  }

  public getStartTimeDateString(): string {
    return new Date(Number(this.startTime)).toLocaleString()
  }

  public getEndTimeDateString(): string {
    return new Date(Number(this.endTime)).toLocaleString()
  }

  public getOriginalVestingByDenom(denom: string): Coin {
    const result = this.originalVesting.find(coin => coin.denom === denom)
    return result === undefined ? new Coin('0', denom) : result;
  }
}

export class Coin {
  amount: string;
  denom: string;

  constructor (amount: string, denom: string) {
    this.amount = amount
    this.denom = denom
  }

}

export class Balances {
  balances: Coin[];

  constructor (balances: Coin[]) {
    this.balances = balances
  }

  public getBalanceByDenom(denom: string): Coin {
    const result = this.balances.find(coin => coin.denom === denom)
    return result === undefined ? new Coin('0', denom) : result;
  }
}

