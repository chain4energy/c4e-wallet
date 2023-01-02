import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createErrorResponse, defaultDenom, expectCoin, expectDecCoin } from '../utils/common.blockchain.data.util';
import { useTokensStore } from '@/store/tokens.store';
import { createCommunityPoolResponseData, createStakingPoolResponseData, createSupplyResponseData, createVestingsLocked, expectStakingPool } from '../utils/tokens.blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';
import { createSingleBalanceResponseData } from '../utils/account.blockchain.data.util';
import { BigDecimal } from '@/models/store/big.decimal';
import {
  createDelegatorDelegationsResponseData,
  createDelegatorUnbondingDelegationsResponseData
} from "../utils/staking.blockchain.data.util";

jest.mock("axios");
const mockedAxios = mockAxios();
const address = 'c4e17svcuc8dt7gr4hlu3rmeu5u0jpc7snar3kdr55';
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
describe('tokens store tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    useConfigurationStore().config.stakingDenom = defaultDenom;

  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
    mockedAxios.request.mockReset();
  });

  it('fetches staking pool - success', async () => {
    const tokensStore = useTokensStore();
    const bonded = 12345n;
    const notBonded = 988756n;

    const stakingPool = {
      data: createStakingPoolResponseData(bonded.toString(), notBonded.toString())
    };

    mockedAxios.request.mockResolvedValueOnce(stakingPool);
    await tokensStore.fetchStakingPool();
    expectStakingPool(tokensStore.getStakingPool, bonded, notBonded);
  });

  it('fetches staking pool - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchStakingPool();

    expectStakingPool(tokensStore.getStakingPool, 0n, 0n);
  });

  it('fetches total supply - success', async () => {
    const tokensStore = useTokensStore();
    const amount = 12345n;
    const supply = {
      data: createSupplyResponseData(amount.toString(), defaultDenom)
    };

    mockedAxios.request.mockResolvedValueOnce(supply);
    await tokensStore.fetchTotalSupply();
    expectCoin(tokensStore.getTotalSupply, amount, defaultDenom);

  });

  it('fetches total supply - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchTotalSupply();

    expectCoin(tokensStore.getTotalSupply, 0n, defaultDenom);
  });

  it('fetches community pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = '123457';
    const communityPool = {
      data: createCommunityPoolResponseData(amount, defaultDenom)
    };
    mockedAxios.request.mockResolvedValueOnce(communityPool);
    await tokensStore.fetchCommunityPool();
    expectDecCoin(tokensStore.getCommunityPool, new BigDecimal(amount), defaultDenom);

  });

  it('fetches community pool - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchCommunityPool();

    expectDecCoin(tokensStore.getCommunityPool, new BigDecimal(0), defaultDenom);
  });

  it('fetches strategic reserve pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = 12111457n;

    const balance = {
      data: createSingleBalanceResponseData(defaultDenom, amount.toString())
    };
    const delegations = {
      data: createDelegatorDelegationsResponseData(address, defaultDelegatorDelegationsValidators, defaultDelegatorDelegationsBalances)
    };
    const undelegations = {
      data: createDelegatorUnbondingDelegationsResponseData(address, defaultDelegatorUnbondingDelegationsValidators, defaultDelegatorUnbondingDelegationsEntriesAmounts)
    };
    let res = 0n;
    res += amount;
    defaultDelegatorDelegationsBalances.forEach(el => res += BigInt(el));
    defaultDelegatorUnbondingDelegationsEntriesAmounts.forEach(arr => {
      arr.forEach(el => res += BigInt(el));
    });
    mockedAxios.request.mockResolvedValueOnce(delegations).mockResolvedValueOnce(undelegations).mockResolvedValueOnce(balance);
    await tokensStore.fetchStrategicReversePool();
    expectCoin(tokensStore.getStrategicReversePool, res, defaultDenom);

  });

  it('fetches strategic reserve - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchStrategicReversePool();

    expectCoin(tokensStore.getStrategicReversePool, 0n, defaultDenom);
  });

  it('fetches airdrop pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = 1211145722n;

    const balance = {
      data: createSingleBalanceResponseData(defaultDenom, amount.toString())
    };

    mockedAxios.request.mockResolvedValueOnce(balance);
    await tokensStore.fetchAirdropPool();
    expectCoin(tokensStore.getAirdropPool, amount, defaultDenom);

  });

  it('fetches airdrop - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchAirdropPool();

    expectCoin(tokensStore.getAirdropPool, 0n, defaultDenom);
  });









  it('fetches locked vesting - success', async () => {
    const amount = 12345n;
    const delegated = 10000n;
    const tokensStore = useTokensStore();

    const vestings = {
      data: createVestingsLocked(amount.toString(), delegated.toString())
    };

    mockedAxios.request.mockResolvedValueOnce(vestings);
    await tokensStore.fetchLockedVesting();
    expect(tokensStore.getLockedVesting).toBe(amount - delegated)

  });

  it('fetches locked vesting - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchLockedVesting();

    expect(tokensStore.getLockedVesting).toBe(0n)
  });

});

