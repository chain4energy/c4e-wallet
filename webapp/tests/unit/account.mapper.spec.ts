import { Account as BcAccount, Balance } from "@/models/blockchain/account";
import { Account as StoreAccount, AccountType, Coin, ContinuousVestingData } from "@/models/store/account";
import { mapAccount, mapBalance } from "@/models/mapper/account.mapper";

describe('map account', () => {

  it('maps BaseAccount', async () => {
    const bcAccount: BcAccount = {
          "@type": "/cosmos.auth.v1beta1.BaseAccount",
          address: "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "dvvcfsvwfevceewcw"
          },
          account_number: "25",
          sequence: "43"
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.BaseAccount);
    expect(storeAccount.address).toBe('c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg');

  });

  it('maps ContinuousVestingAccount', async () => {
    const bcAccount: BcAccount = {
      "@type": "/cosmos.vesting.v1beta1.ContinuousVestingAccount",
      base_vesting_account: {
        base_account: {
          address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "dvvcfsvwfevceewcw"
          },
          account_number: "52",
          sequence: "1"
        },
        original_vesting: [
          {
            denom: "uc4e",
            amount: "100000000000"
          }
        ],
        delegated_free: [],
        delegated_vesting: [
          {
            denom: "uc4e",
            amount: "12"
          }
        ],
        end_time: "1657372098"
      },
      start_time: "1657112898"
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
    expect(storeAccount.type).toBe(AccountType.ContinuousVestingAccount);
    expect(storeAccount.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
    expect(storeAccount.continuousVestingData?.endTime).toBe('1657372098000');
    expect(storeAccount.continuousVestingData?.startTime).toBe('1657112898000');
    expect(storeAccount.continuousVestingData?.originalVesting.length).toBe(1);
    const origVesting = storeAccount.continuousVestingData?.originalVesting[0]
    expect(origVesting?.amount).toBe('100000000000');
    expect(origVesting?.denom).toBe('uc4e');
  });

  it('maps ModuleAccount', async () => {
    const bcAccount: BcAccount = {
      "@type": "/cosmos.auth.v1beta1.ModuleAccount",
      base_account: {
        address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
        pub_key: {
          "@type": "/cosmos.crypto.secp256k1.PubKey",
          key: "dvvcfsvwfevceewcw"
        },
        account_number: "52",
        sequence: "1"
      },
      name: "test_account"
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
  });

  it('maps BaseVestingAccount', async () => {
    const bcAccount: BcAccount = {
      "@type": "/cosmos.vesting.v1beta1.BaseVestingAccount",
      base_account: {
        address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
        pub_key: {
          "@type": "/cosmos.crypto.secp256k1.PubKey",
          key: "dvvcfsvwfevceewcw"
        },
        account_number: "52",
        sequence: "1"
      },
      original_vesting: [
        {
          denom: "uc4e",
          amount: "100000000000"
        }
      ],
      delegated_free: [],
      delegated_vesting: [
        {
          denom: "uc4e",
          amount: "12"
        }
      ],
      end_time: "1657372098"
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
  });

  it('maps DelayedVestingAccount', async () => {
    const bcAccount: BcAccount = {
      "@type": "/cosmos.vesting.v1beta1.DelayedVestingAccount",
      base_vesting_account: {
        base_account: {
          address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "dvvcfsvwfevceewcw"
          },
          account_number: "52",
          sequence: "1"
        },
        original_vesting: [
          {
            denom: "uc4e",
            amount: "100000000000"
          }
        ],
        delegated_free: [],
        delegated_vesting: [
          {
            denom: "uc4e",
            amount: "12"
          }
        ],
        end_time: "1657372098"
      },
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
  });

  it('maps PeriodicVestingAccount', async () => {
    const bcAccount: BcAccount = {
      "@type": "/cosmos.vesting.v1beta1.PeriodicVestingAccount",
      base_vesting_account: {
        base_account: {
          address: "c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "dvvcfsvwfevceewcw"
          },
          account_number: "52",
          sequence: "1"
        },
        original_vesting: [
          {
            denom: "uc4e",
            amount: "100000000000"
          }
        ],
        delegated_free: [],
        delegated_vesting: [
          {
            denom: "uc4e",
            amount: "12"
          }
        ],
        end_time: "1657372098"
      },
      amount: [],
      length: 123
    } as BcAccount;

    const storeAccount = mapAccount(bcAccount);
    expect(storeAccount).toBeInstanceOf(StoreAccount);
    expect(storeAccount.continuousVestingData).toBeUndefined();
    expect(storeAccount.type).toBe(AccountType.Unknown);
    expect(storeAccount.address).toBe('c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55');
  });

  it('maps unsupported account', async () => {
    const bcAccount: BcAccount = {
          "@type": "/cosmos.auth.v1beta1.UnsupportedAccount",
          address: "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
          pub_key: {
            "@type": "/cosmos.crypto.secp256k1.PubKey",
            key: "dvvcfsvwfevceewcw"
          },
          account_number: "25",
          sequence: "43"
    } as BcAccount;

    expect(() => {mapAccount(bcAccount)}).toThrowError(new Error(`Unsupported account type: '/cosmos.auth.v1beta1.UnsupportedAccount'`))
  });

  it('maps unexpected data', async () => {
    const bcAccount: BcAccount = {
          address: "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
    } as unknown as BcAccount;

    expect(() => {mapAccount(bcAccount)}).toThrowError(new Error(`Unsupported account type: 'undefined'`))
  });

  it('maps undefined data', async () => {
    expect(() => {mapAccount(undefined)}).toThrowError(new Error('Account is undefined'))
  });

  it('maps balance', async () => {
    const bcBalance: Balance = {
          denom: "uc4e",
          amount: "43"
    };

    const coin = mapBalance(bcBalance, 'denom');
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.amount).toBe('43');
    expect(coin.denom).toBe('uc4e');

  });

  it('maps undefined balance', async () => {
    const coin = mapBalance(undefined, 'denom');
    expect(coin).toBeInstanceOf(Coin);
    expect(coin.amount).toBe('0');
    expect(coin.denom).toBe('denom');

  });
});