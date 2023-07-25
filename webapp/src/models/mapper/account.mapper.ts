import {
  Account as BcAccount,
  BaseAccount,
  ContinuousVestingAccount,
  PeriodicContinuousVestingAccount
} from "@/models/blockchain/account";
import {Account as StoreAccount, AccountType, ContinuousVestingData, VestingPeriods} from "@/models/store/account";
import {Coin} from "@/models/store/common";

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
    case "/chain4energy.c4echain.cfevesting.PeriodicContinuousVestingAccount": {
      const bcAccount = account as unknown as PeriodicContinuousVestingAccount;
      const result = new StoreAccount(AccountType.PeriodicContinuousVestingAccount, bcAccount.base_vesting_account.base_account.address);
      const origVesting = new Array<Coin>();
      bcAccount.base_vesting_account.original_vesting?.forEach((coin) => {
        const c = new Coin(BigInt(coin.amount), coin.denom);
        origVesting.push(c);
      });
      const startTime = new Date(Number(bcAccount.start_time)*secToMilis);
      const endTime = new Date(Number(bcAccount.base_vesting_account.end_time)*secToMilis);
      result.continuousVestingData = new ContinuousVestingData(startTime, endTime, origVesting);

      const vestingPeriods = new Array<VestingPeriods>();

      bcAccount.vesting_periods?.forEach((period) => {
        const amounts = new Array<Coin>();
        period.amount.forEach((coin) => {
          const c = new Coin(BigInt(coin.amount), coin.denom);
          amounts.push(c);
        });
        const p = new VestingPeriods(period.start_time, period.end_time, amounts);
        vestingPeriods.push(p);
      });

      result.vestingPeriods = vestingPeriods;

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

