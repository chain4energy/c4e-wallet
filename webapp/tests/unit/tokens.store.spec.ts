import { setActivePinia, createPinia } from 'pinia'
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createErrorResponse, defaultDenom, expectCoin } from '../utils/common.blockchain.data.util';
import { useTokensStore } from '@/store/tokens.store';
import { createCommunityPoolResponseData, createStakingPoolResponseData, createSupplyResponseData, expectStakingPool } from '../utils/tokens.blockchain.data.util';
import { useConfigurationStore } from '@/store/configuration.store';
import { createSingleBalanceResponseData } from '../utils/account.blockchain.data.util';

jest.mock("axios");
const mockedAxios = mockAxios();

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
    const bonded = '12345';
    const notBonded = '988756';

    const stakingPool = {
      data: createStakingPoolResponseData(bonded, notBonded)
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

    expectStakingPool(tokensStore.getStakingPool, '0', '0');
  });

  it('fetches total supply - success', async () => {
    const tokensStore = useTokensStore();
    const amount = '12345';
    const supply = {
      data: createSupplyResponseData(amount, defaultDenom)
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

    expectCoin(tokensStore.getTotalSupply, '0', defaultDenom);
  });

  it('fetches community pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = '123457';
    const communityPool = {
      data: createCommunityPoolResponseData(amount, defaultDenom)
    };
    mockedAxios.request.mockResolvedValueOnce(communityPool);
    await tokensStore.fetchCommunityPool();
    expectCoin(tokensStore.getCommunityPool, amount, defaultDenom);

  });

  it('fetches community pool - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchCommunityPool();

    expectCoin(tokensStore.getCommunityPool, '0', defaultDenom);
  });

  it('fetches strategic reserve pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = '12111457';

    const balance = {
      data: createSingleBalanceResponseData(defaultDenom, amount)
    };

    mockedAxios.request.mockResolvedValueOnce(balance);
    await tokensStore.fetchStrategicReversePool();
    expectCoin(tokensStore.getStrategicReversePool, amount, defaultDenom);

  });

  it('fetches strategic reserve - error', async () => {
    const tokensStore = useTokensStore();
    const validatorsError = createErrorResponse(404, 5, 'some error');
    mockedAxios.request.mockRejectedValueOnce(validatorsError);
    await tokensStore.fetchStrategicReversePool();

    expectCoin(tokensStore.getStrategicReversePool, '0', defaultDenom);
  });

  it('fetches airdrop pool - success', async () => {
    const tokensStore = useTokensStore();
    const amount = '1211145722';

    const balance = {
      data: createSingleBalanceResponseData(defaultDenom, amount)
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

    expectCoin(tokensStore.getAirdropPool, '0', defaultDenom);
  });

});

