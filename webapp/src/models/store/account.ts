import { useConfigurationStore } from "@/store/configuration.store";

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

  constructor (type: AccountType, address: string) {
    this.type = type;
    this.address = address;
  }

}

export class ContinuousVestingData {
  startTime: string;
  endTime: string;
  originalVesting: Coin[];

  constructor (startTime: string, endTime: string, originalVesting: Coin[]) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.originalVesting = originalVesting;
  }

  public getStartTimeDateString(): string {
    return new Date(Number(this.startTime)).toLocaleString();
  }

  public getEndTimeDateString(): string {
    return new Date(Number(this.endTime)).toLocaleString();
  }

  public getOriginalVestingByDenom(denom: string): Coin {
    const result = this.originalVesting.find(coin => coin.denom === denom);
    return result === undefined ? new Coin('0', denom) : result;
  }

  public calculateVestingLocked(latestBlockTime: string): number{ // TODO number to BigInt
    const validtime = Date.parse(latestBlockTime);
    const endTime = Number(this.endTime);
    if (validtime >= endTime) {
      return 0;
    }
    const startTime = Number(this.startTime);
    const denom = useConfigurationStore().config.stakingDenom;
    const origVesting = Number(this.getOriginalVestingByDenom(denom).amount);
    if (validtime <= startTime) {
      return origVesting;
    }

    const x = validtime - startTime;
    const y = endTime - startTime;
    const diference = x/y;
    const unlocked = origVesting * diference;
    const locked = origVesting - unlocked;
    return locked;
  }
}

export class Coin {
  amount: string;
  denom: string;

  constructor (amount: string, denom: string) {
    this.amount = amount;
    this.denom = denom;
  }

}

export class Balances {
  balances: Coin[];

  constructor (balances: Coin[]) {
    this.balances = balances;
  }

  public getBalanceByDenom(denom: string): Coin {
    const result = this.balances.find(coin => coin.denom === denom);
    return result === undefined ? new Coin('0', denom) : result;
  }
}

