import { Account, AccountType, ContinuousVestingData } from "@/models/store/account";
import { AxiosResponse } from "axios";
import { accountNotFoundErrorMessage, axiosError404Message, axiosErrorMessagePrefix, createAxiosError, createErrorResponseData, defaultDenom } from "./common.blockchain.data.util";

export const vestingAccountTimeToSystem = '000';
export const defaultBaseAccountType = '/cosmos.auth.v1beta1.BaseAccount';
export const defaultContinuousVestingAccountStartTime = '1657112898';
export const defaultContinuousVestingAccountEndTime = '1657372098';

export const defaultContinuousVestingAccountOriginalVesting = [
  {
    denom: defaultDenom,
    amount: '100000000000'
  }
];

export function createBaseAccountResponseData(address: string) {
  return {
    account: createBaseAccount(address)
  }
}

export function createBaseAccount(address: string, type = defaultBaseAccountType) {
  return {
    "@type": type,
    address: address,
    pub_key: {
      "@type": "/cosmos.crypto.secp256k1.PubKey",
      key: "Al619Y81/xqLCl6oREVwtBPpcwv0RuR9C4KbdNQnOwbB"
    },
    account_number: "25",
    sequence: "43"
  }
}

export function createContinuousVestingAccountResponseData(address: string) {
  return {
    account: createContinuousVestingAccount(address)
  }
}

export function createContinuousVestingAccount(address: string,
  startTime = defaultContinuousVestingAccountStartTime,
  endTime = defaultContinuousVestingAccountEndTime,
  originalVesting = defaultContinuousVestingAccountOriginalVesting) {
  return {
    "@type": "/cosmos.vesting.v1beta1.ContinuousVestingAccount",
    base_vesting_account: {
      base_account: {
        address: address,
        pub_key: {
          "@type": "/cosmos.crypto.secp256k1.PubKey",
          key: "dvvcfsvwfevceewcw"
        },
        account_number: "52",
        sequence: "1"
      },
      original_vesting: originalVesting,
      delegated_free: [],
      delegated_vesting: [
        {
          denom: defaultDenom,
          amount: "12"
        }
      ],
      end_time: endTime
    },
    start_time: startTime
  }
}

export function createModuleAccountResponseData(address: string) {
  return {
    account: createModuleAccount(address)
  }
}

export function createModuleAccount(address: string) {
  return {
    "@type": "/cosmos.auth.v1beta1.ModuleAccount",
    base_account: {
      address: address,
      pub_key: {
        "@type": "/cosmos.crypto.secp256k1.PubKey",
        key: "dvvcfsvwfevceewcw"
      },
      account_number: "52",
      sequence: "1"
    },
    name: "test_account"
  }
}

export function createBaseVestingAccountResponseData(address: string) {
  return {
    account: createBaseVestingAccount(address)
  }
}

export function createBaseVestingAccount(address: string) {
  return {
    "@type": "/cosmos.vesting.v1beta1.BaseVestingAccount",
    base_account: {
      address: address,
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
  }
}

export function createDelayedVestingAccountResponseData(address: string) {
  return {
    account: createDelayedVestingAccount(address)
  }
}

export function createDelayedVestingAccount(address: string) {
  return {
    "@type": "/cosmos.vesting.v1beta1.DelayedVestingAccount",
    base_vesting_account: {
      base_account: {
        address: address,
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
  }
}

export function createPeriodicVestingAccountResponseData(address: string) {
  return {
    account: createPeriodicVestingAccount(address)
  }
}

export function createPeriodicVestingAccount(address: string) {
  return {
    "@type": "/cosmos.vesting.v1beta1.PeriodicVestingAccount",
    base_vesting_account: {
      base_account: {
        address: address,
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
  }
}

export function createSingleBalanceResponseData(denom: string, amount: string) {
  return {
    balance: createSingleBalance(denom, amount)
  }
}

export function createSingleBalance(denom: string, amount: string) {
  return {
    denom: denom,
    amount: amount
  }
}

export function createAddressNotExistsErrorResponse() {
  const response = {
    data: createErrorResponseData(5, accountNotFoundErrorMessage),
    status: 404,
    statusText: '',
  };
  return createAxiosError(axiosError404Message, response as AxiosResponse);
}

export function createErrorResponse(status: number, blockchainErrorCode: number, blockchaineErrorMessage: string) {
  const axiosErrorMessage = axiosErrorMessagePrefix + status;
  const response = {
    data: createErrorResponseData(blockchainErrorCode, blockchaineErrorMessage),
    status: status,
    statusText: '',
  };
  return createAxiosError(axiosErrorMessage, response as AxiosResponse);
}

export function expectBaseAccount(account: Account | undefined, expectedAddress: string) {
  expect(account).toBeInstanceOf(Account);
  expect(account?.continuousVestingData).toBeUndefined();
  expect(account?.type).toBe(AccountType.BaseAccount);
  expect(account?.address).toBe(expectedAddress);
}

export function expectNonExistentAccount(account: Account | undefined, expectedAddress: string) {
  expect(account).toBeInstanceOf(Account);
  expect(account?.continuousVestingData).toBeUndefined();
  expect(account?.type).toBe(AccountType.Nonexistent);
  expect(account?.address).toBe(expectedAddress);
}

export function expectDisconnectedAccount(account: Account | undefined) {
  expect(account).toBeInstanceOf(Account);
  expect(account?.continuousVestingData).toBeUndefined();
  expect(account?.type).toBe(AccountType.Disconnected);
  expect(account?.address).toBe('');
}

export function expectContinuousVestingAccount(account: Account | undefined, expectedAddress: string) {
  expect(account).toBeInstanceOf(Account);
  expect(account?.address).toBe(expectedAddress);
  expect(account?.type).toBe(AccountType.ContinuousVestingAccount);
  expect(account?.continuousVestingData).toBeInstanceOf(ContinuousVestingData);
  expect(account?.continuousVestingData?.endTime).toBe(defaultContinuousVestingAccountEndTime + vestingAccountTimeToSystem);
  expect(account?.continuousVestingData?.startTime).toBe(defaultContinuousVestingAccountStartTime + vestingAccountTimeToSystem);
  expect(account?.continuousVestingData?.originalVesting.length).toBe(defaultContinuousVestingAccountOriginalVesting.length);
  const origVesting = account?.continuousVestingData?.originalVesting[0]
  expect(origVesting?.amount).toBe(defaultContinuousVestingAccountOriginalVesting[0].amount);
  expect(origVesting?.denom).toBe(defaultContinuousVestingAccountOriginalVesting[0].denom);
}