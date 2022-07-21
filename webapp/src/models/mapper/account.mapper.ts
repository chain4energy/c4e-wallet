import { Account as BcAccount, BaseAccount, ContinuousVestingAccount} from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType, ContinuousVestingData, Coin} from "@/models/store/account";

export function createNonexistentAccount(address: string): StoreAccount  {
  return new StoreAccount(AccountType.Nonexistent, address);
}
export function mapAccount(account: BcAccount | undefined): StoreAccount  {
  if (account === undefined) {
      throw new Error('Account is undefined');
  }
  const typeUrl = account["@type"];
  switch (typeUrl) {
    case "/cosmos.auth.v1beta1.BaseAccount": {
      const bcAccount = account as unknown as BaseAccount;
      return new StoreAccount(AccountType.BaseAccount, bcAccount.address);
    }
    case "/cosmos.auth.v1beta1.ModuleAccount": {
      const bcAccount = (account as any).base_account as BaseAccount;
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.BaseVestingAccount": {
      const bcAccount = (account as any).base_account as BaseAccount;
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.ContinuousVestingAccount": {
      const bcAccount = account as unknown as ContinuousVestingAccount;
      const result = new StoreAccount(AccountType.ContinuousVestingAccount, bcAccount.base_vesting_account.base_account.address);
      const origVesting = new Array<Coin>();
      bcAccount.base_vesting_account.original_vesting?.forEach((coin) => {
        const c = new Coin(coin.amount, coin.denom);
        origVesting.push(c);
      });
      const vestingData = new ContinuousVestingData(bcAccount.start_time + '000', bcAccount.base_vesting_account.end_time + '000', origVesting);
      result.continuousVestingData = vestingData;
      return result;

    }
    case "/cosmos.vesting.v1beta1.DelayedVestingAccount": {
      const bcAccount = (account as any).base_vesting_account.base_account as BaseAccount;
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.PeriodicVestingAccount": {
      const bcAccount = (account as any).base_vesting_account.base_account as BaseAccount;
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }

    default:
      throw new Error(`Unsupported account type: '${typeUrl}'`);
  }
}

// export function mapBalance(balance: Balance | undefined, denom: string): Coin  {
//   if (balance === undefined) {
//     return new Coin('0', denom);
//   }
//   if (balance.amount === undefined || balance.denom === undefined) {
//     throw new Error(`no amount or denom defined`);
//   }
//   return new Coin(balance.amount, balance.denom);
// }
