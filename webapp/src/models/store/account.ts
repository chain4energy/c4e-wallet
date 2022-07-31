import { useConfigurationStore } from "@/store/configuration.store";
import { Coin, findByDenom } from "./common";

export enum AccountType {
  Disconnected,
  BaseAccount,
  ContinuousVestingAccount,
  Unknown,
  Nonexistent
}

export class Account {

  static disconnected = new Account(AccountType.Disconnected, '');

  type: AccountType;
  address: string;
  continuousVestingData?: ContinuousVestingData;

  constructor (type: AccountType, address: string, continuousVestingData?: ContinuousVestingData) {
    this.type = type;
    this.address = address;
    this.continuousVestingData = continuousVestingData;
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

  public calculateVestingLocked(latestBlockTime: Date): bigint{
    const validtime = latestBlockTime.getTime();
    const endTime = this.endTime.getTime();
    if (validtime >= endTime) {
      return 0n;
    }
    const startTime = this.startTime.getTime();
    const denom = useConfigurationStore().config.stakingDenom;
    const origVesting = this.getOriginalVestingByDenom(denom).amount;
    if (validtime <= startTime) {
      return origVesting;
    }

    const x = validtime - startTime;
    const y = endTime - startTime;
    const unlocked = (BigInt(x) * origVesting) / BigInt(y);
    const locked = origVesting - unlocked;
    return locked;
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

