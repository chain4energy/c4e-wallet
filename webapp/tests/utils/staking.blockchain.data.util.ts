import { Delegations, UnbondingDelegations } from "@/models/store/staking";
import { defaultDenom } from "./common.blockchain.data.util";

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
throw new Error('Amount : ' + validatorAddress + ' not found');
}

export function findDelegatorDelegationTotalAmount(
balancesAmount = defaultDelegatorDelegationsBalances) {
let amount = 0n
balancesAmount.forEach(ba => {
  amount += BigInt(ba);
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
let amount = 0n;
entriesAmounts.forEach(ents => {
  ents.forEach(ent => { amount += BigInt(ent);})

})
return amount;
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

export function expectDelegatorDelegations(delegations: Delegations | undefined,
    expectedValidators = defaultDelegatorDelegationsValidators,
    expectedBalancesAmount = defaultDelegatorDelegationsBalances) {
  expect(delegations?.delegations.size).toBe(expectedValidators.length);
  expect(delegations?.totalDelegated).toBe(findDelegatorDelegationTotalAmount(expectedBalancesAmount));
  expectedValidators.forEach(validatorAddress => {
    const delegation = delegations?.delegations.get(validatorAddress);
    expect(delegation?.amount).toBe(BigInt(findDelegatorDelegationAmountByValidator(validatorAddress, expectedValidators, expectedBalancesAmount)));
    expect(delegation?.validatorAddress).toBe(validatorAddress);
  });
}


export function expectDelegatorUnbondingDelegations(undelegations: UnbondingDelegations | undefined,
    expectedValidators = defaultDelegatorUnbondingDelegationsValidators,
    expectedEntriesAmounts = defaultDelegatorUnbondingDelegationsEntriesAmounts) {
  expect(undelegations?.undelegations.size).toBe(expectedValidators.length);
  expect(undelegations?.totalUndelegating).toBe(findDelegatorUnbondingDelegationTotalAmount(expectedEntriesAmounts));
  expectedValidators.forEach(validatorAddress => {
    const undelegation = undelegations?.undelegations.get(validatorAddress);
    const validatorExpecedEntries = findDelegatorUnbondingDelegationAmountByValidator(validatorAddress, expectedValidators, expectedEntriesAmounts);
    expect(undelegation?.entries.length).toBe(validatorExpecedEntries.length);
    for (let i = 0; i < validatorExpecedEntries.length; i++) {
      expect(undelegation?.entries[i].amount).toBe(BigInt(validatorExpecedEntries[i]));

    }
    expect(undelegation?.validatorAddress).toBe(validatorAddress);
  });
}