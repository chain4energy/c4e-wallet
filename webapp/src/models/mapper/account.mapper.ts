import { Account as BcAccount, BaseAccount, ContinuousVestingAccount} from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType, ContinuousVestingData, Coin} from "@/models/store/account";

export function mapAccount(account: BcAccount): StoreAccount  {
  const typeUrl = account["@type"]
  switch (typeUrl) {
    case "/cosmos.auth.v1beta1.BaseAccount":
      const bcAccount = account as unknown as BaseAccount;
      return new StoreAccount(AccountType.BaseAccount, bcAccount.address);
    case "/cosmos.auth.v1beta1.ModuleAccount": {
      const bcAccount = (account as any).base_account as BaseAccount
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.BaseVestingAccount": {
      const bcAccount = (account as any).base_account as BaseAccount
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.ContinuousVestingAccount": {
      const bcAccount = account as unknown as ContinuousVestingAccount;
      const result = new StoreAccount(AccountType.ContinuousVestingAccount, bcAccount.base_vesting_account.base_account.address);
      const origVesting = new Array<Coin>()
      bcAccount.base_vesting_account.original_vesting?.forEach((coin) => {
        const c = new Coin(coin.amount, coin.denom);
        origVesting.push(c)
      });
      const vestingData = new ContinuousVestingData(bcAccount.start_time, bcAccount.base_vesting_account.end_time, origVesting)
      result.continuousVestingData = vestingData
      return result;

    }
    case "/cosmos.vesting.v1beta1.DelayedVestingAccount": {
      const bcAccount = (account as any).base_vesting_account.base_account as BaseAccount
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }
    case "/cosmos.vesting.v1beta1.PeriodicVestingAccount": {
      const bcAccount = (account as any).base_vesting_account.base_account as BaseAccount
      return new StoreAccount(AccountType.Unknown, bcAccount.address);
    }

    default:
      throw new Error(`Unsupported type: '${typeUrl}'`);
  }
}