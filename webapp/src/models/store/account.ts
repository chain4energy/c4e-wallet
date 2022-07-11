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
}

export class Coin {
  amount: string;
  denom: string;

  constructor (amount: string, denom: string) {
    this.amount = amount
    this.denom = denom
  }

}



// accountNumber : number;
// delegation_response: object;

// "@type": string,
// pub_key: {
//   type: string,
//   key: string,
// },
// account_number: string,
// sequence: string,
// base_vesting_account:{
//   base_account: {
//     account_number:string,
//     address: string
//   },
//   end_time: string,
//   original_vesting: Array<Amount>,
// }
// start_time: string,