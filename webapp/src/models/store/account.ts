import { useConfigurationStore } from "@/store/configuration.store";
import { Coin, findByDenom } from "./common";
import {calculateLockedVesting} from "@/utils/vesting-utils";

export enum AccountType {
  Disconnected,
  BaseAccount,
  ContinuousVestingAccount,
  Unknown,
  Nonexistent,
  PeriodicContinuousVestingAccount
}



export class Account {

  static disconnected = new Account(AccountType.Disconnected, '');

  type: AccountType;
  address: string;
  continuousVestingData?: ContinuousVestingData;
  vestingPeriods?: VestingPeriods[];

  constructor (type: AccountType, address: string, continuousVestingData?: ContinuousVestingData, vestingPeriods?: VestingPeriods[]) {
    this.type = type;
    this.address = address;
    this.continuousVestingData = continuousVestingData;
    this.vestingPeriods = vestingPeriods;
  }

}

export class ContinuousVestingData {
  startTime: Date;
  endTime: Date;
  originalVesting: Coin[];

  constructor (startTime: Date, endTime: Date, originalVesting: Coin[]) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.originalVesting = originalVesting;
  }

  public getStartTimeDateString(): string {
    return this.startTime.toLocaleString();
  }

  public getEndTimeDateString(): string {
    return this.endTime.toLocaleString();
  }

  public getOriginalVestingByDenom(denom: string): Coin {
    return findByDenom(this.originalVesting, denom);
  }

  public calculateVestingLocked(latestBlockTime: Date): bigint {
    const blockTime = latestBlockTime.getTime();
    const endTime = this.endTime.getTime();
    const startTime = this.startTime.getTime();
    const denom = useConfigurationStore().config.stakingDenom;
    const origVestingAmount = this.getOriginalVestingByDenom(denom).amount;

    return calculateLockedVesting(startTime, endTime, blockTime, origVestingAmount);
  }
}

export class Balances {
  balances: Coin[];

  constructor (balances: Coin[]) {
    this.balances = balances;
  }

  public getBalanceByDenom(denom: string): Coin {
    return findByDenom(this.balances, denom);
  }
}

export class VestingPeriods {
  startTime: number;
  endTime: number;
  amount: Coin[];

  constructor(startTime: number, endTime: number, amount: Coin[]) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.amount = amount;
  }
}

