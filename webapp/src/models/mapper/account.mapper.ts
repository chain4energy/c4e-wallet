import { Account as BcAccount, BaseAccount, ContinuousVestingAccount} from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType, ContinuousVestingData } from "@/models/store/account";
import { Coin} from "@/models/store/common";

const secToMilis = 1000;

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
        const c = new Coin(BigInt(coin.amount), coin.denom);
        origVesting.push(c);
      });
      const startTime = new Date(Number(bcAccount.start_time)*secToMilis);
      const endTime = new Date(Number(bcAccount.base_vesting_account.end_time)*secToMilis);
      const vestingData = new ContinuousVestingData(startTime, endTime, origVesting);
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

