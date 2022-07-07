import {Amount} from "@/models/TotalSupply";
import { array } from "yup";
export interface account{
    accountNumber : number;
    delegation_response: object;
    type : string,
    "@type": string,
    address: string,
    pub_key: {
      type: string,
      key: string,
    },
    account_number: string,
    sequence: string,
    base_vesting_account:{
      base_account: {
        account_number:string,
        address: string
      },
      end_time: string,
      original_vesting: Array<Amount>,
    }
    start_time: string,

}

export interface Account{
  account: account
}
// export interface Balances{
//   balances: Array<Amount>,
//   pagination: object,
// }
export interface balances {
  balances: Array<Amount>,
  pagination: object
}
