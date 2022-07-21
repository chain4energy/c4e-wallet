import { Account as BcAccount } from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType } from "@/models/store/account";
import { mapAccount } from "@/models/mapper/account.mapper";
import { createBaseAccount, createBaseVestingAccount, createContinuousVestingAccount, createDelayedVestingAccount, createModuleAccount, createPeriodicVestingAccount, expectBaseAccount, expectContinuousVestingAccount } from '../utils/account.blockchain.data.util';

const address = 'c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg'

describe('map account', () => {

  it('maps BaseAccount', async () => {
    const bcAccount: BcAccount = createBaseAccount(address) as BcAccount;
    const storeAccount = mapAccount(bcAccount);
    expectBaseAccount(storeAccount, address);

    // expect(storeAccount).toBeInstanceOf(StoreAccount);
    // expect(storeAccount.continuousVestingData).toBeUndefined();
    // expect(storeAccount.type).toBe(AccountType.BaseAccount);
    // expect(storeAccount.address).toBe(address);

  });

  it('maps ContinuousVestingAccount', async () => {
    const bcAccount: BcAccount = createContinuousVestingAccount(address) as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expectContinuousVestingAccount(storeAccount, address);
    // expect(storeAccount).toBeInstanceOf(StoreAccount);
    // expect(storeAccount.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
    // expect(storeAccount.type).toBe(AccountType.ContinuousVestingAccount);
    // expect(storeAccount.address).toBe(address);
    // expect(storeAccount.continuousVestingData?.endTime).toBe(defaultContinuousVestingAccountEndTime + vestingAccountTimeToSystem);
    // expect(storeAccount.continuousVestingData?.startTime).toBe(defaultContinuousVestingAccountStartTime + vestingAccountTimeToSystem);
    // expect(storeAccount.continuousVestingData?.originalVesting.length).toBe(defaultContinuousVestingAccountOriginalVesting.length);
    // const origVesting = storeAccount.continuousVestingData?.originalVesting[0]
    // expect(origVesting?.amount).toBe(defaultContinuousVestingAccountOriginalVesting[0].amount);
    // expect(origVesting?.denom).toBe(defaultContinuousVestingAccountOriginalVesting[0].denom);
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

});