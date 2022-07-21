import { setActivePinia, createPinia } from 'pinia'
import apiFactory from "@/api/factory.api";
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createCommunityPoolResponseData, createStakingPoolResponseData, createSupplyResponseData, expectStakingPool } from '../utils/tokens.blockchain.data.util';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse, defaultErrorName, defaultDenom, expectCoin } from '../utils/common.blockchain.data.util';

jest.mock("axios");
const mockedAxios = mockAxios();
const api = apiFactory.tokensApi()

describe('account api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  })

  it('gets staking pool - exists', async () => {
    const bonded = '12345';
    const notBonded = '988756';

    const stakingPool = {
      data: createStakingPoolResponseData(bonded, notBonded)
    };

    mockedAxios.request.mockResolvedValue(stakingPool);
    const result = await api.fetchStakingPool();
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectStakingPool(result.data, bonded, notBonded);

  });

  it('gets staking pool - error', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchStakingPool();
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets staking pool - bad data', async () => { 
    const stakingPool = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(stakingPool);
    const result = await api.fetchStakingPool();
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('Staking Pool is undefined');
    expect(result.error?.data).toBeUndefined();
  });

  it('gets total supply - exists', async () => {
    const amount = '12345';

    const supply = {
      data: createSupplyResponseData(amount, defaultDenom)
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchTotalSupply(defaultDenom);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, amount, defaultDenom);

  });

  it('gets total supply - errors', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchTotalSupply(defaultDenom);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets total supply - bad data', async () => { 
    const supply = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchTotalSupply(defaultDenom);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, '0', defaultDenom);
  });

  it('gets community pool - denom exists', async () => {
    const amount = '12345';

    const supply = {
      data: createCommunityPoolResponseData(amount, defaultDenom)
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, amount, defaultDenom);

  });

  it('gets community pool - denom does not exist', async () => {
    const amount = '12345';

    const supply = {
      data: createCommunityPoolResponseData(amount, 'someDenom')
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, '0', defaultDenom);

  });

  it('gets community pool - errors', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets total supply - bad data', async () => { 
    const communityPool = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(communityPool);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, '0', defaultDenom);
  });
});



