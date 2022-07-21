import { StakingPool } from "@/models/store/tokens"

export function createStakingPoolResponseData(bonded: string, notBonded: string) {
  return {
    pool:  {
      bonded_tokens: bonded,
      not_bonded_tokens: notBonded
    }
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

export function expectStakingPool(stakingPool: StakingPool | undefined, expectedBonded: string, expectedNotBonded: string) {
  expect(stakingPool).not.toBeUndefined();
  expect(stakingPool?.bondedTokens).toBe(expectedBonded);
  expect(stakingPool?.notBondedTokens).toBe(expectedNotBonded);
}
