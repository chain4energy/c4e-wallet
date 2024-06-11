import { setActivePinia, createPinia } from 'pinia';
import apiFactory from "@/api/factory.api";
import { mockAxios } from '../utils/mock.util';
import { useSplashStore } from '@/store/splash.store';
import {
  createCommunityPoolResponseData,
  createDistributorParamsResponseData,
  createStakingPoolResponseData,
  createSupplyResponseData, createTokenPriceHistorySingleElement,
  createVestingsLocked, defaultDistributionParams,
  expectStakingPool
} from '../utils/tokens.blockchain.data.util';
import { axiosErrorMessagePrefix, defaultAxiosErrorName, createErrorResponse, defaultErrorName, defaultDenom, expectCoin, expectDecCoin } from '../utils/common.blockchain.data.util';
import { BigDecimal } from '@/models/store/big.decimal';
import {TokenPrice} from "@/models/store/tokens";
import {Currency} from "@/models/currency";
import {createHasuraError, defaultHasuraErrorMessage, defaultHasuraErrorName} from "../utils/common.hasura.data.util";

jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() }
      }
    })),
    request: jest.fn(),
    AxiosError: jest.fn()
  };
});
const mockedAxios = mockAxios();
const api = apiFactory.tokensApi();

describe('tokens api tests', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    expect(useSplashStore().splashCounter).toBe(0);
    mockedAxios.request.mockClear();
  });

  it('gets staking pool - exists', async () => {
    const bonded = 12345n;
    const notBonded = 988756n;

    const stakingPool = {
      data: createStakingPoolResponseData(bonded.toString(), notBonded.toString())
    };

    mockedAxios.request.mockResolvedValue(stakingPool);
    const result = await api.fetchStakingPool(false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

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
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

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
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectCoin(result.data, 0n, defaultDenom);
  });

  it('gets community pool - denom exists', async () => {
    const amount = '12345';

    const communityPool = {
      data: createCommunityPoolResponseData(amount, defaultDenom)
    };

    mockedAxios.request.mockResolvedValue(communityPool);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expectDecCoin(result.data, new BigDecimal(amount), defaultDenom);

  });

  it('gets community pool - denom does not exist', async () => {
    const amount = '12345';

    const communityPool = {
      data: createCommunityPoolResponseData(amount, 'someDenom')
    };

    mockedAxios.request.mockResolvedValue(communityPool);
    const result = await api.fetchCommunityPoolByDenom(defaultDenom, false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

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
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

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
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data).toBe(amount - delegated);
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
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expect(result.data).toBe(0n);
  });

  it('gets sharesParam - exists', async () => {
    const distributionParams = {
      data: createDistributorParamsResponseData()
    };
    let resSum = 0;
    let burn_share = 0;
    defaultDistributionParams.forEach(param => {
      if(param.name == 'inflation_and_fee_distributor') {
        burn_share = param.burn_share;
        param.shares.forEach(share => resSum += share);
      }
    });

    mockedAxios.request.mockResolvedValue(distributionParams);
    const result = await api.fetchShareParameter(false);
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();

    expect(result.data).toBe(1 - resSum - burn_share);

  });

  it('gets sharesParam - data ok', async () => {
    const distributionParams = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(distributionParams);
    const result = await api.fetchTokenPriceHistory("c4e", 1, true);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);

  });

  it('gets token price - data error', async () => {
    const errorMessage = 'expected a non-negative 32-bit integer for type \'Int\', but found a number';
    const avgResp = {
      data: createHasuraError("$.selectionSet.token_price_history.args.limit", errorMessage),
    };

    mockedAxios.request.mockResolvedValue(avgResp);

    const result = await api.fetchTokenPriceHistory("c4e", -1, true);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).not.toBeUndefined();
    expect(result.error?.message).toBe(defaultHasuraErrorMessage);
    expect(result.error?.name).toBe(defaultHasuraErrorName);
    expect(result.error?.status).toBe(200);
    expect(result.error?.data?.errors).not.toBeUndefined();
    expect(result.error?.data?.errors.length).toBe(1);
    expect(result.error?.data?.errors[0].message).toBe(errorMessage);

  });


  it('gets token price - data ok', async () => {
    const price =  0.076694;
    const timestamp = "2024-06-07T10:03:02.935";
    const tokenPriceHistory = {
      data: createTokenPriceHistorySingleElement(price, timestamp)
    };

    mockedAxios.request.mockResolvedValue(tokenPriceHistory);
    const result = await api.fetchTokenPriceHistory("c4e", 1, true);
    console.log("response: " + JSON.stringify(result));
    expect(result.isError()).toBe(false);
    expect(result.isSuccess()).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.data).toStrictEqual( Array(new TokenPrice(price, new Date(timestamp), Currency.USD)));

  });

  it('gets token price - bad data', async () => {
    const distributionParams = {
      data: {}
    };

    mockedAxios.request.mockResolvedValue(distributionParams);
    const result = await api.fetchTokenPriceHistory("c4e", 1, true);
    expect(result.isError()).toBe(true);
    expect(result.isSuccess()).toBe(false);

  });
});



