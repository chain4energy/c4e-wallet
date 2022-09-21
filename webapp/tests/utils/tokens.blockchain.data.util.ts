import { StakingPool } from "@/models/store/tokens"

export function createStakingPoolResponseData(bonded: string, notBonded: string) {
  return {
    pool:  createStakingPool(bonded, notBonded)
  }
}

export function createStakingPool(bonded: string, notBonded: string) {
  return {
    bonded_tokens: bonded,
    not_bonded_tokens: notBonded
  }
}

export function createSupplyResponseData(amount: string, denom: string) {
  return {
    amount:  {
      amount: amount,
      denom: denom
    }
  }
}

export function createCommunityPoolResponseData(amount: string, denom: string) {
  const testDenom = 'testxy';
  if (denom.startsWith(testDenom)) {
    throw new Error('Do not start denom with: ' + testDenom);
  }
  const expectedBcCoin = { amount: amount, denom: denom };
  const coins = new Array();
  coins.push(expectedBcCoin);
  for (let i = 0; i < 10; i++) {
    coins.push({ amount: '' + 100 + i, denom: testDenom + 1 });
  }
  coins[5] = expectedBcCoin;
  return {
    pool: coins
  }
}

export function expectStakingPool(stakingPool: StakingPool | undefined, expectedBonded: bigint, expectedNotBonded: bigint) {
  expect(stakingPool).not.toBeUndefined();
  expect(stakingPool?.bondedTokens).toBe(expectedBonded);
  expect(stakingPool?.notBondedTokens).toBe(expectedNotBonded);
}

export function createVestingsLocked(vestingAllAmount: string, delegatedVestingAmount: string) {
  return {
    vesting_all_amount: vestingAllAmount,
    vesting_in_pools_amount: "0",
    vesting_in_accounts_amount: "0",
    delegated_vesting_amount: delegatedVestingAmount
  }
}
