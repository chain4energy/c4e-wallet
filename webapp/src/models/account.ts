import {Amount} from "@/models/TotalSupply";
export interface account{
    accountNumber : number;
    delegation_response: object;
    type : string,
    "@type": string,
    address: StringConstructor,
    pub_key: {
      type: string,
      key: string,
    },
    account_number: string,
    sequence: string,
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
