import { AxiosError, AxiosResponse } from "axios";

export const accountNotFoundErrorMessage = 'rpc error: code = NotFound desc = account c4e1xe3x4w0ma4dv805q0rhe0c7xk3mv24vatg7pm3 not found: key not found';
export const axiosErrorMessagePrefix = 'Request failed with status code ';
export const axiosError404Message = axiosErrorMessagePrefix + '404';

export const vestingAccountTimeToSystem = '000';
export const defaultBaseAccountType = '/cosmos.auth.v1beta1.BaseAccount';
export const defaultContinuousVestingAccountStartTime = '1657112898';
export const defaultContinuousVestingAccountEndTime = '1657372098';
export const defaultDenom = 'uc4e';
export const defaultContinuousVestingAccountOriginalVesting = [
  {
    denom: defaultDenom,
    amount: '100000000000'
  }
];
export const defaultRewardsValidators = [
  'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
  'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5'
]
export const defaultRewardsCoins = [
  [
    {
      denom: defaultDenom,
      amount: '94674698.350135527836087568'
    }
  ],
  [
    {
      denom: defaultDenom,
      amount: '94774371.034393892953000000'
    }
  ]
];
export const defaultRewardsTotal = [
  {
    denom: defaultDenom,
    amount: '701806492.986585310106087069'
  }
];
export const defaultAxiosErrorName = 'AxiosError';
export const defaultErrorName = 'Error';
export const defaultDelegatorDelegationsValidators = [
  'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
  'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5',
  'c4evaloper1r2ennr6ywv567lks3q5gujt4def726fep2hpa8',
  'c4evaloper19473sdmlkkvcdh6z3tqedtqsdqj4jjv782dku2',
  'c4evaloper1tavkv9fpqwmw2v9drsm7s3yk7xlll9q8n7e6yl',
  'c4evaloper1e0ddzmhw2ze2glszkgjk6tfvcfzv68cmrg7euh',
];
export const defaultDelegatorDelegationsBalances = [
  '100011000000',
  '98012949002',
  '100013000000',
  '100014000000',
  '100015000000',
  '100016000000',
];

export const defaultDelegatorUnbondingDelegationsValidators = [
  'c4evaloper1psaq0n2lzh84lzgh39kghuy0n256xltlg6yh4a',
  'c4evaloper1zwl9pd5mmn23mze2686494w9c2fyymxaqrhhl5'
];
export const defaultDelegatorUnbondingDelegationsEntriesAmounts = [
  ['30000000', '40000000'],
  ['10000000'],
];

export function findTotalRewards(denom = defaultDenom,
  rewardsCoins = defaultRewardsTotal) {
  for (let i = 0; i < rewardsCoins.length; i++) {
    if (rewardsCoins[i].denom === denom) {
      return rewardsCoins[i];
    }
  }
  throw new Error('rewardsCoins for denom: ' + denom + ' not found')
}

export function findRewardsByValidator(validatorAddress: string,
  validators = defaultRewardsValidators,
  rewardsCoins = defaultRewardsCoins) {
  if (validators.length !== rewardsCoins.length) {
    throw new Error('validators.length !== rewardsCoins.length')
  } 
  for (let i = 0; i < validators.length; i++) {
    if (validators[i] === validatorAddress) {
      return rewardsCoins[i];
    }
  }
  throw new Error('rewardsCoins not found')
}

export function findDelegatorDelegationAmountByValidator(validatorAddress: string,
    validators = defaultDelegatorDelegationsValidators,
    balancesAmount = defaultDelegatorDelegationsBalances) {
  if (validators.length !== balancesAmount.length) {
    throw new Error('validators.length !== balancesAmount.length')
  } 
  for (let i = 0; i < validators.length; i++) {
    if (validators[i] === validatorAddress) {
      return balancesAmount[i];
    }
  }
  return null;
}

export function findDelegatorDelegationTotalAmount(
  balancesAmount = defaultDelegatorDelegationsBalances) {
  let amount = 0
  balancesAmount.forEach(ba => {
    amount += Number(ba);
  })
  return amount;
}

export function findDelegatorUnbondingDelegationAmountByValidator(validatorAddress: string,
  validators = defaultDelegatorUnbondingDelegationsValidators,
  entriesAmounts = defaultDelegatorUnbondingDelegationsEntriesAmounts): string[]{
  if (validators.length !== entriesAmounts.length) {
    throw new Error('validators.length !== entriesAmounts.length')
  } 
  for (let i = 0; i < validators.length; i++) {
    if (validators[i] === validatorAddress) {
      return entriesAmounts[i];
    }
  }
  throw new Error('entries not found')

}

export function findDelegatorUnbondingDelegationTotalAmount(
  entriesAmounts = defaultDelegatorUnbondingDelegationsEntriesAmounts) {
  let amount = 0
  entriesAmounts.forEach(ents => {
    ents.forEach(ent => { amount += Number(ent);})

  })
  return amount;
}

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

export function createRewardsResponseData(validators = defaultRewardsValidators, rewards = defaultRewardsCoins, total = defaultRewardsTotal) {
  return {
    rewards: createRewards(validators, rewards),
    total: total
  }
}

export function createRewards(validators = defaultRewardsValidators, rewards = defaultRewardsCoins) {
  if (validators.length !== rewards.length) {
    throw new Error('validators.length !== rewards.length')
  }
  const rewardsArray = new Array()
  for (let i = 0; i < validators.length; i++) {
    rewardsArray.push({
      validator_address: validators[i],
      reward: rewards[i]
    })
  }
  return rewardsArray;
}

export function createDelegatorDelegationsResponseData(address: string,
    validators = defaultDelegatorDelegationsValidators,
    balancesAmount = defaultDelegatorDelegationsBalances,
    denom = defaultDenom,
    total: number | undefined = undefined,
    nextKey: string | null = null) {
  if (validators.length !== balancesAmount.length) {
    throw new Error('validators.length !== balancesAmount.length')
  }
  const delegations = new Array();
  for (let i = 0; i < validators.length; i++) {
    delegations.push({
      delegation: { 
        delegator_address: address,
        validator_address: validators[i],
        shares: balancesAmount[i] + '.000000000000000000'
      },
      balance: { 
        denom: denom,
        amount: balancesAmount[i] 
      } 
    })
  }
  return {
    delegation_responses: createDelegatorDelegations(address, validators, balancesAmount, denom),
    pagination: {
      next_key: nextKey,
      total: total === undefined ? validators.length : total
    }
  }
}

export function createDelegatorDelegations(address: string,
    validators = defaultDelegatorDelegationsValidators,
    balancesAmount = defaultDelegatorDelegationsBalances,
    denom = defaultDenom) {
  if (validators.length !== balancesAmount.length) {
    throw new Error('validators.length !== balancesAmount.length')
  }
  const delegations = new Array();
  for (let i = 0; i < validators.length; i++) {
    delegations.push({
      delegation: { 
        delegator_address: address,
        validator_address: validators[i],
        shares: balancesAmount[i] + '.000000000000000000'
      },
      balance: { 
        denom: denom,
        amount: balancesAmount[i] 
      } 
    })
  }
  return delegations;

}

export function createDelegatorUnbondingDelegationsResponseData(address: string,
    validators = defaultDelegatorUnbondingDelegationsValidators,
    entriesAmounts = defaultDelegatorUnbondingDelegationsEntriesAmounts,
    total: number | undefined = undefined,
    nextKey: string | null = null) {
  return {
    unbonding_responses: createDelegatorUnbondingDelegations(address, validators, entriesAmounts),
    pagination: {
      next_key: nextKey,
      total: total === undefined ? validators.length : total
    }
  }
}

export function createDelegatorUnbondingDelegations(address: string,
  validators = defaultDelegatorUnbondingDelegationsValidators,
  entriesAmounts = defaultDelegatorUnbondingDelegationsEntriesAmounts) {
if (validators.length !== entriesAmounts.length) {
  throw new Error('validators.length !== entriesAmounts.length')
}
const undelegations = new Array();
for (let i = 0; i < validators.length; i++) {
  const entries = new Array();
  entriesAmounts[i].forEach(amount => {
    entries.push({
      creation_height: "764970",
      completion_time: "2022-08-03T11:18:32.854838508Z",
      initial_balance: amount,
      balance: amount
    })
  })

  undelegations.push({ 
    delegator_address: address,
    validator_address: validators[i],
    entries: entries
  })
}
return  undelegations;
}

export function createErrorResponseData(code: number, message: string) {
  return {
    code: code,
    message: message,
    details: []
  }
}

export function createAxiosError(message: string, response: AxiosResponse, name = defaultAxiosErrorName): AxiosError {
  const error = new AxiosError();
  error.name = name;
  error.message = message;
  error.response = response;
  return error;
}
