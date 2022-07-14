export function createBaseAccountResponse(address: string) {
  return {
    account: createBaseAccount(address)
  }
}

export function createBaseAccount(address: string, type = "/cosmos.auth.v1beta1.BaseAccount") {
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

export function createContinuousVestingAccountResponse(address: string) {
  return {
    account: createContinuousVestingAccount(address)
  }
}

export function createContinuousVestingAccount(address: string) {
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
    }
}

export function createModuleAccountResponse(address: string) {
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

export function createBaseVestingAccountResponse(address: string) {
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

export function createDelayedVestingAccountResponse(address: string) {
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

export function createPeriodicVestingAccountResponse(address: string) {
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

// 'uc4e', '49031887606805'
export function createSingleBalanceResponse(denom: string, amount: string) {
  return {
    balance: {
      denom: denom,
      amount: amount
    }
  }
}

export function createRewardsResponse() {
  return {
    rewards: [
      {
        validator_address: "c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a",
        reward: [
          {
            denom: "uc4e",
            amount: "94674698.350135527836087568"
          }
        ]
      },
      {
        validator_address: "c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5",
        reward: [
          {
            denom: "uc4e",
            amount: "94774371.034393892953000000"
          }
        ]
      },
    ],
    total: [
      {
        denom: "uc4e",
        amount: "701806492.986585310106087069"
      }
    ]
  }
}

export function createDelegationsResponse() {
  return {
    "delegation_responses": [
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a","shares":"100011000012.000000000000000000"},"balance":{"denom":"uc4e","amount":"100011000012"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5","shares":"100013000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"100013000000"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8","shares":"100003000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"98012949002"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2","shares":"100013000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"100013000000"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl","shares":"100013000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"100013000000"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh","shares":"100011000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"100011000000"}},
      {"delegation":{"delegator_address":"c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg","validator_address":"c4evaloper1arwuhz0tg28ld0sry5s083qs6djjqt5vl8dtjl","shares":"100012000000.000000000000000000"},"balance":{"denom":"uc4e","amount":"100012000000"}}
    ],
    "pagination": {
      "next_key": null,
      "total": "7"
    }
  }
}

export function createUnbondingDelegationsResponse() {
  return {
    "unbonding_responses": [
      {
        "delegator_address": "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
        "validator_address": "c4evaloper1r2ennr6ywv567lks3qfsdsdafsdfa",
        "entries": [
          {
            "creation_height": "764970",
            "completion_time": "2022-08-03T11:18:32.854838508Z",
            "initial_balance": "100000000",
            "balance": "100000000"
          },
          {
            "creation_height": "764970",
            "completion_time": "2022-08-03T11:18:32.854838508Z",
            "initial_balance": "30000000",
            "balance": "30000000"
          }
        ]
      },
      {
        "delegator_address": "c4e13zg4u07ymq83uq73t2cq3dj54jj37zzgqfwjpg",
        "validator_address": "c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8",
        "entries": [
          {
            "creation_height": "764970",
            "completion_time": "2022-08-03T11:18:32.854838508Z",
            "initial_balance": "10000000",
            "balance": "10000000"
          }
        ]
      }
    ],
    "pagination": {
      "next_key": null,
      "total": "1"
    }
  }
}

export function createErrorResponse(code: number, message: string) {
  return {
    code: code,
    message: message,
    details: []
  }
}
