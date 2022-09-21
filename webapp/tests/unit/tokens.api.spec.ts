import { setActivePinia, createPinia } from 'pinia'
import apiFactory from "@/api/factory.api";
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import { createCommunityPoolResponseData, createStakingPoolResponseData, createSupplyResponseData, createVestingsLocked, expectStakingPool } from '../utils/tokens.blockchain.data.util';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse, defaultErrorName, defaultDenom, expectCoin, expectDecCoin } from '../utils/common.blockchain.data.util';
import { BigDecimal } from '@/models/store/big.decimal';

jest.mock("axios");
const mockedAxios = mockAxios();
const api = apiFactory.tokensApi()

describe('tokens api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  })

  it('gets staking pool - exists', async () => {
    const bonded = 12345n;
    const notBonded = 988756n;

    const stakingPool = {
      data: createStakingPoolResponseData(bonded.toString(), notBonded.toString())
    };

    mockedAxios.request.mockResolvedValue(stakingPool);
    const result = await api.fetchStakingPool(false);
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
    const result = await api.fetchStakingPool(false);
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
    const result = await api.fetchStakingPool(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultErrorName);
    expect(result.error?.message).toBe('Staking Pool is undefined');
    expect(result.error?.data).toBeUndefined();
  });

  it('gets total supply - exists', async () => {
    const amount = 12345n;

    const supply = {
      data: createSupplyResponseData(amount.toString(), defaultDenom)
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchTotalSupply(defaultDenom, false);
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
    const result = await api.fetchTotalSupply(defaultDenom, false);
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
    const result = await api.fetchTotalSupply(defaultDenom, false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectCoin(result.data, 0n, defaultDenom);
  });

  it('gets community pool - denom exists', async () => {
    const amount = '12345';

    const communityPool = {
      data: createCommunityPoolResponseData(amount, defaultDenom)
    };

    mockedAxios.request.mockResolvedValue(communityPool);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectDecCoin(result.data, new BigDecimal(amount), defaultDenom);

  });

  it('gets community pool - denom does not exist', async () => {
    const amount = '12345';

    const communityPool = {
      data: createCommunityPoolResponseData(amount, 'someDenom')
    };

    mockedAxios.request.mockResolvedValue(communityPool);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectDecCoin(result.data, new BigDecimal(0), defaultDenom);

  });

  it('gets community pool - errors', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
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
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expectDecCoin(result.data, new BigDecimal(0), defaultDenom);
  });

  it('gets vestings locked - exists', async () => {
    const amount = 12345n;
    const delegated = 10000n;

    const vestings = {
      data: createVestingsLocked(amount.toString(), delegated.toString())
    };

    mockedAxios.request.mockResolvedValue(vestings);
    const result = await api.fetchVestingLockedNotDelegated(false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()
    expect(result.data).toBe(amount - delegated)
  });

  it('gets vestings locked - errors', async () => {
    const errorMessage = 'rpc error: code = InvalidArgument desc = invalid address: decoding bech32 failed: invalid checksum (expected xq32ez got tg7pm3): invalid request';

    const status = 400;
    const error = createErrorResponse(status, 3, errorMessage);

    mockedAxios.request.mockRejectedValueOnce(error);
    const result = await api.fetchVestingLockedNotDelegated(false);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.error?.name).toBe(defaultAxiosErrorName);
    expect(result.error?.message).toBe(axiosErrorMessagePrefix + status);
    expect(result.error?.data?.code).toBe(3);
    expect(result.error?.data?.message).toBe(errorMessage);

  });

  it('gets vestings locked - bad data', async () => { 
    const supply = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(supply);
    const result = await api.fetchVestingLockedNotDelegated(false);
    expect(result.isError()).toBe(false)
    expect(result.isSuccess()).toBe(true)
    expect(result.error).toBeUndefined()

    expect(result.data).toBe(0n)
  });
});



