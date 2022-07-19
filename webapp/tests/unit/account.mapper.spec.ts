import { Account as BcAccount, Balance } from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType, Coin, ContinuousVestingData } from "@/models/store/account";
import { mapAccount, mapBalance } from "@/models/mapper/account.mapper";
import { defaultDenom } from "../utils/common.blockchain.data.util";
import { createBaseAccount, createBaseVestingAccount, createContinuousVestingAccount, createDelayedVestingAccount, createModuleAccount, createPeriodicVestingAccount, createSingleBalance, defaultContinuousVestingAccountEndTime, defaultContinuousVestingAccountOriginalVesting, defaultContinuousVestingAccountStartTime, vestingAccountTimeToSystem } from '../utils/account.blockchain.data.util';

const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg'
const denom = defaultDenom
const secondDenom = 'denom'

describe('map account', () => {

  it('maps BaseAccount', async () => {
    const bcAccount: BcAccount = createBaseAccount(address) as BcAccount;
    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.BaseAccount);
    expect(storeAccount.address).toBe(address);

  });

  it('maps ContinuousVestingAccount', async () => {
    const bcAccount: BcAccount = createContinuousVestingAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
    expect(storeAccount.type).toBe(AccountType.ContinuousVestingAccount);
    expect(storeAccount.address).toBe(address);
    expect(storeAccount.continuousVestingData?.endTime).toBe(defaultContinuousVestingAccountEndTime + vestingAccountTimeToSystem);
    expect(storeAccount.continuousVestingData?.startTime).toBe(defaultContinuousVestingAccountStartTime + vestingAccountTimeToSystem);
    expect(storeAccount.continuousVestingData?.originalVesting.length).toBe(defaultContinuousVestingAccountOriginalVesting.length);
    const origVesting = storeAccount.continuousVestingData?.originalVesting[0]
    expect(origVesting?.amount).toBe(defaultContinuousVestingAccountOriginalVesting[0].amount);
    expect(origVesting?.denom).toBe(defaultContinuousVestingAccountOriginalVesting[0].denom);
  });

  it('maps ModuleAccount', async () => {
    const bcAccount: BcAccount = createModuleAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe(address);
  });

  it('maps BaseVestingAccount', async () => {
    const bcAccount: BcAccount = createBaseVestingAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe(address);
  });

  it('maps DelayedVestingAccount', async () => {
    const bcAccount: BcAccount = createDelayedVestingAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe(address);
  });

  it('maps PeriodicVestingAccount', async () => {
    const bcAccount: BcAccount = createPeriodicVestingAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe(address);
  });

  it('maps unsupported account', async () => {
    const type = '/cosmos.auth.v1beta1.UnsupportedAccount';
    const bcAccount: BcAccount = createBaseAccount(address, type) as BcAccount;
    expect(() => {mapAccount(bcAccount)}).toThrowError(new Error(`Unsupported account type: '` + type + `'`))
  });

  it('maps account unexpected data', async () => {
    const bcAccount: BcAccount = {
          address: address,
    } as unknown as BcAccount;

    expect(() => {mapAccount(bcAccount)}).toThrowError(new Error(`Unsupported account type: 'undefined'`))
  });

  it('maps account undefined data', async () => {
    expect(() => {mapAccount(undefined)}).toThrowError(new Error('Account is undefined'))
  });

  it('maps balance', async () => {
    const amount = '43';
    const bcBalance: Balance = createSingleBalance(denom, amount)

    const coin = mapBalance(bcBalance, secondDenom);
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.amount).toBe(amount);
    expect(coin.denom).toBe(denom);

  });

  it('maps undefined balance', async () => {
    const coin = mapBalance(undefined, secondDenom);
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.amount).toBe('0');
    expect(coin.denom).toBe(secondDenom);

  });

  it('maps balance unexpected data', async () => {
    const bcBalance: Balance = {
          address: address,
    } as unknown as Balance;

    expect(() => {mapBalance(bcBalance, secondDenom)}).toThrowError(new Error(`no amount or denom defined`))
  });

});