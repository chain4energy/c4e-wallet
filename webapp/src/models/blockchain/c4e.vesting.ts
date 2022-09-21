import { Coin } from "./common";

export interface Vestings {
  vesting_all_amount: string;
  vesting_in_pools_amount: string;
  vesting_in_accounts_amount: string;
  delegated_vesting_amount: string;
}
