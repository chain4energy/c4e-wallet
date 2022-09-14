import {VestingAccount} from "@/models/hasura/vesting.accounts";

export function createVestingAccount(start_time: string, end_time: string, denom: string, amount: string) {
  return {
    start_time,
    end_time,
    original_vesting: [
      {
        denom,
        amount,
      }
    ]
  };
}

export function createDefaultVestingAccounts(vestingAccount: VestingAccount, vestingAccountsNumber: number) {
  const vestingAccounts = [];
  for (let i = 0; i < vestingAccountsNumber; i++) {
    vestingAccounts.push(vestingAccount);
  }
  return vestingAccounts;
}

